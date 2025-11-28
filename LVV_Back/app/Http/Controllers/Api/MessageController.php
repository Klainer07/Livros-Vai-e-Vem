<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Book;
use App\Models\User;

class MessageController extends Controller
{
    // Enviar mensagem
    public function send(Request $request)
    {
        $data = $request->validate([
            'book_id' => 'required|exists:books,id',
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
            'message_text' => 'required|string',
        ]);

        $message = Message::create($data);

        return response()->json($message, 201);
    }

    // Listar mensagens entre dois usuários
    
    public function list($book_id, $sender_id, $receiver_id)
    {
        
        if (!Book::find($book_id) || !User::find($sender_id) || !User::find($receiver_id)) {
            return response()->json([]);
        }

        $messages = Message::where('book_id', $book_id)
            ->where(function($q) use ($sender_id, $receiver_id) {
                $q->where(function($q2) use ($sender_id, $receiver_id) {
                    $q2->where('sender_id', $sender_id)
                       ->where('receiver_id', $receiver_id);
                })
                ->orWhere(function($q2) use ($sender_id, $receiver_id) {
                    $q2->where('sender_id', $receiver_id)
                       ->where('receiver_id', $sender_id);
                });
            })
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }
}
