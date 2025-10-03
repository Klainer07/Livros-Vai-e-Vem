<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;

class BookController extends Controller
{
    public function index() { return Book::all(); }
    public function show($id) { return Book::findOrFail($id); }

    public function store(Request $request){
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'pageCount' => 'required|integer|min:1',
            'excerpt' => 'nullable|string',
            'publishDate' => 'required|date',
        ]);
        return Book::create($validated);
    }

    public function update(Request $request, $id){
        $book = Book::findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'pageCount' => 'sometimes|required|integer|min:1',
            'excerpt' => 'nullable|string',
            'publishDate' => 'sometimes|required|date',
        ]);
        $book->update($validated);
        return $book;
    }

    public function destroy($id){
        $book = Book::findOrFail($id);
        $book->delete();
        return response()->noContent();
    }
}
