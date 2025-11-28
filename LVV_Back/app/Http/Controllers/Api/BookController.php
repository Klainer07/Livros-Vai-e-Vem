<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use Illuminate\Validation\Rule;

class BookController extends Controller
{
    //API externa, diferente busca, uma funciona
    private function fetchCoverFromGoogleBooks(string $title, string $author = null)
    {
        $search = function ($query) {
            try {
                $url = "https://www.googleapis.com/books/v1/volumes?q=" . urlencode($query);
                $response = @file_get_contents($url);
                if (!$response) return null;

                $data = json_decode($response, true);

                if (
                    isset($data['items']) &&
                    isset($data['items'][0]['volumeInfo']['imageLinks']['thumbnail'])
                ) {
                    return str_replace("http://", "https://", $data['items'][0]['volumeInfo']['imageLinks']['thumbnail']);
                }
            } catch (\Exception $e) {
                return null;
            }
            return null;
        };

        
        $cover = $search(trim($title . ' ' . ($author ?? '')));
        if ($cover) return $cover;

        
        $cover = $search($title);
        if ($cover) return $cover;

        
        try {
            $normalized = @iconv('UTF-8', 'ASCII//TRANSLIT', $title);
            if ($normalized !== false) {
                $simpleTitle = preg_replace('/[^a-zA-Z0-9 ]/', '', $normalized);
                $cover = $search($simpleTitle);
                if ($cover) return $cover;
            }
        } catch (\Exception $e) {
            
        }

        
        $keywords = array_filter(explode(' ', $title), fn($w) => strlen($w) > 3);
        if (!empty($keywords)) {
            $cover = $search(implode(' ', $keywords));
            if ($cover) return $cover;
        }

        
        $parts = explode(' ', $title);
        if (count($parts) > 0) {
            $cover = $search($parts[0]);
            if ($cover) return $cover;
        }

        return null; // nada
    }

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
            'status' => ['nullable', Rule::in(['para emprestar','para doar','emprestado','doado'])],
            'location' => 'nullable|string|max:255',
            'user_id' => 'required|exists:users,id',
        ]);

        $cover = $request->cover_image ?? $this->fetchCoverFromGoogleBooks($request->title, $request->author);

        $book = Book::create([
            'title' => $request->title,
            'author' => $request->author,
            'genre' => $request->genre,
            'condition' => $request->condition,
            'cover_image' => $cover,
            'status' => $request->status ?? 'para emprestar',
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
            'status' => ['nullable', Rule::in(['para emprestar','para doar','emprestado','doado'])],
            'location' => 'nullable|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);

        
        $titleChanged = $request->title && $request->title !== $book->title;
        $authorChanged = $request->author && $request->author !== $book->author;

        if (($titleChanged || $authorChanged) && !$request->cover_image) {
            $book->cover_image = $this->fetchCoverFromGoogleBooks(
                $request->title ?? $book->title,
                $request->author ?? $book->author
            );
        } else {
            $book->cover_image = $request->cover_image ?? $book->cover_image;
        }

        $book->title = $request->title ?? $book->title;
        $book->author = $request->author ?? $book->author;
        $book->genre = $request->genre ?? $book->genre;
        $book->condition = $request->condition ?? $book->condition;

        
        if (isset($request->status) && $book->status === 'doado' && $request->status !== 'doado') {
            return response()->json(['message' => 'Não é possível alterar o status de um livro doado.'], 400);
        }

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

    // Preview de capa
    public function preview(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'author' => 'nullable|string',
        ]);

        $cover = $this->fetchCoverFromGoogleBooks($request->title, $request->author);

        return response()->json([
            'cover_image' => $cover
        ], 200);
    }
}
