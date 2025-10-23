<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use Illuminate\Validation\Rule;

class BookController extends Controller
{

    // Listar todos os livros
    public function index()
    {
        $books = Book::with('user')->get(); 
        return response()->json($books, 200);
    }

    // Criar novo livro
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'genre' => 'nullable|string|max:100',
            'condition' => 'nullable|string|max:50',
            'cover_image' => 'nullable|url',
            'status' => ['nullable', Rule::in(['disponível','emprestado','trocado'])],
            'location' => 'nullable|string|max:255',
            'user_id' => 'required|exists:users,id',
        ]);

        $book = Book::create([
            'title' => $request->title,
            'author' => $request->author,
            'genre' => $request->genre,
            'condition' => $request->condition,
            'cover_image' => $request->cover_image,
            'status' => $request->status ?? 'disponível',
            'location' => $request->location,
            'user_id' => $request->user_id,
        ]);

        return response()->json($book, 201);
    }

    // Mostrar detalhes de um livro
    public function show($id)
    {
        $book = Book::with('user','ratings')->find($id);
        if (!$book) {
            return response()->json(['message' => 'Livro não encontrado'], 404);
        }
        return response()->json($book, 200);
    }

    // Atualizar livro
    public function update(Request $request, $id)
    {
        $book = Book::find($id);
        if (!$book) {
            return response()->json(['message' => 'Livro não encontrado'], 404);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'author' => 'sometimes|required|string|max:255',
            'genre' => 'nullable|string|max:100',
            'condition' => 'nullable|string|max:50',
            'cover_image' => 'nullable|url',
            'status' => ['nullable', Rule::in(['disponível','emprestado','trocado'])],
            'location' => 'nullable|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $book->title = $request->title ?? $book->title;
        $book->author = $request->author ?? $book->author;
        $book->genre = $request->genre ?? $book->genre;
        $book->condition = $request->condition ?? $book->condition;
        $book->cover_image = $request->cover_image ?? $book->cover_image;
        $book->status = $request->status ?? $book->status;
        $book->location = $request->location ?? $book->location;
        $book->user_id = $request->user_id ?? $book->user_id;

        $book->save();

        return response()->json($book, 200);
    }

    // Deletar livro
    public function destroy($id)
    {
        $book = Book::find($id);
        if (!$book) {
            return response()->json(['message' => 'Livro não encontrado'], 404);
        }

        $book->delete();
        return response()->json(['message' => 'Livro deletado com sucesso'], 200);
    }
}
