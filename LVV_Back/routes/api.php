<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\RatingController;

// FICAR ATENTO PARA PROTEGER ALGUMAS ROTAS



Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);          // Listar todos os usuários
    Route::post('/', [UserController::class, 'store']);         // Criar novo usuário
    Route::get('/{id}', [UserController::class, 'show']);       // Mostrar detalhes de um usuário
    Route::put('/{id}', [UserController::class, 'update']);     // Atualizar um usuário
    Route::delete('/{id}', [UserController::class, 'destroy']); // Deletar um usuário
});


Route::post('/login', [UserController::class, 'login']); // Login (gera token)

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserController::class, 'logout']); // Logout (desgera token)
    Route::get('/me', [UserController::class, 'me']);          // Retorna o usuário logado
});


Route::prefix('books')->group(function () {
    Route::get('/', [BookController::class, 'index']);          // Listar todos os livros
    Route::post('/', [BookController::class, 'store']);         // Criar novo livro
    Route::get('/{id}', [BookController::class, 'show']);       // Mostrar detalhes de um livro
    Route::put('/{id}', [BookController::class, 'update']);     // Atualizar um livro
    Route::delete('/{id}', [BookController::class, 'destroy']); // Deletar um livro
});


Route::prefix('transactions')->group(function () {
    Route::get('/', [TransactionController::class, 'index']);       // Listar todas
    Route::post('/', [TransactionController::class, 'store']);      // Criar nova
    Route::get('/{id}', [TransactionController::class, 'show']);    // Ver detalhes
    Route::put('/{id}', [TransactionController::class, 'update']);  // Atualizar
    Route::delete('/{id}', [TransactionController::class, 'destroy']); // Deletar
});


Route::prefix('ratings')->group(function () {
    Route::get('/', [RatingController::class, 'index']);      // Listar todas as avaliações
    Route::post('/', [RatingController::class, 'store']);     // Criar avaliação
    Route::get('/{id}', [RatingController::class, 'show']);   // Detalhes
    Route::put('/{id}', [RatingController::class, 'update']); // Atualizar
    Route::delete('/{id}', [RatingController::class, 'destroy']); // Deletar
});