<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Book;
use Illuminate\Validation\Rule;

class TransactionController extends Controller
{
 
    public function index()
    {
        $transactions = Transaction::with(['book', 'sender', 'receiver'])->get();
        return response()->json($transactions, 200);
    }

   
    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id|different:sender_id',
            'type' => ['required', Rule::in(['borrow', 'exchange'])],
            'status' => ['nullable', Rule::in(['pending','approved','rejected','completed'])],
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $book = Book::find($request->book_id);
        if (!$book->isAvailable()) {
            return response()->json(['message' => 'Livro não está disponível para transação'], 400);
        }

        $transaction = Transaction::create([
            'book_id' => $request->book_id,
            'sender_id' => $request->sender_id,
            'receiver_id' => $request->receiver_id,
            'type' => $request->type,
            'status' => $request->status ?? 'pending',
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);

        // Atualiza o status do livro se a transação for aprovada
        if ($transaction->status === 'approved') {
            $book->status = 'emprestado';
            $book->save();
        }

        return response()->json($transaction, 201);
    }

    
    public function show($id)
    {
        $transaction = Transaction::with(['book', 'sender', 'receiver'])->find($id);
        if (!$transaction) {
            return response()->json(['message' => 'Transação não encontrada'], 404);
        }
        return response()->json($transaction, 200);
    }


    public function update(Request $request, $id)
    {
        $transaction = Transaction::find($id);
        if (!$transaction) {
            return response()->json(['message' => 'Transação não encontrada'], 404);
        }

        $request->validate([
            'status' => ['nullable', Rule::in(['pending','approved','rejected','completed'])],
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $transaction->status = $request->status ?? $transaction->status;
        $transaction->start_date = $request->start_date ?? $transaction->start_date;
        $transaction->end_date = $request->end_date ?? $transaction->end_date;
        $transaction->save();

        // Atualiza o status do livro conforme o status da transação
        $book = $transaction->book;
        if ($transaction->status === 'approved') {
            $book->status = 'emprestado';
        } elseif ($transaction->status === 'completed' || $transaction->status === 'rejected') {
            $book->status = 'disponível';
        }
        $book->save();

        return response()->json($transaction, 200);
    }

    
    public function destroy($id)
    {
        $transaction = Transaction::find($id);
        if (!$transaction) {
            return response()->json(['message' => 'Transação não encontrada'], 404);
        }

        $transaction->delete();
        return response()->json(['message' => 'Transação deletada com sucesso'], 200);
    }
}
