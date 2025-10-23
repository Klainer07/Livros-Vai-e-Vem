<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rating;

class RatingController extends Controller
{
    // Listar todas as avaliações
    public function index()
    {
        $ratings = Rating::with(['rater', 'ratedUser', 'book', 'transaction'])->get();
        return response()->json($ratings, 200);
    }

    // Criar nova avaliação
    public function store(Request $request)
    {
        $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
            'rater_id' => 'required|exists:users,id',
            'rated_user_id' => 'required|exists:users,id',
            'book_id' => 'required|exists:books,id',
            'score' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $rating = Rating::create([
            'transaction_id' => $request->transaction_id,
            'rater_id' => $request->rater_id,
            'rated_user_id' => $request->rated_user_id,
            'book_id' => $request->book_id,
            'score' => $request->score,
            'comment' => $request->comment,
        ]);

        return response()->json([
            'message' => 'Avaliação criada com sucesso',
            'rating' => $rating,
        ], 201);
    }

    // Mostrar detalhes de uma avaliação
    public function show($id)
    {
        $rating = Rating::with(['rater', 'ratedUser', 'book', 'transaction'])->find($id);
        if (!$rating) {
            return response()->json(['message' => 'Avaliação não encontrada'], 404);
        }

        return response()->json($rating, 200);
    }

    // Atualizar uma avaliação existente
    public function update(Request $request, $id)
    {
        $rating = Rating::find($id);
        if (!$rating) {
            return response()->json(['message' => 'Avaliação não encontrada'], 404);
        }

        $request->validate([
            'score' => 'sometimes|required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $rating->score = $request->score ?? $rating->score;
        $rating->comment = $request->comment ?? $rating->comment;
        $rating->save();

        return response()->json([
            'message' => 'Avaliação atualizada com sucesso',
            'rating' => $rating,
        ], 200);
    }

    // Deletar uma avaliação
    public function destroy($id)
    {
        $rating = Rating::find($id);
        if (!$rating) {
            return response()->json(['message' => 'Avaliação não encontrada'], 404);
        }

        $rating->delete();
        return response()->json(['message' => 'Avaliação deletada com sucesso'], 200);
    }
}
