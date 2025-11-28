<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\MessageController;


// USERS
Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/', [UserController::class, 'store']);
    Route::get('/{id}', [UserController::class, 'show']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);
});

Route::post('/login', [UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/me', [UserController::class, 'me']);
});


// BOOKS
Route::prefix('books')->group(function () {
    Route::get('/preview', [BookController::class, 'preview']);
    Route::get('/', [BookController::class, 'index']);
    Route::post('/', [BookController::class, 'store']);
    Route::get('/{id}', [BookController::class, 'show']);
    Route::put('/{id}', [BookController::class, 'update']);
    Route::delete('/{id}', [BookController::class, 'destroy']);
});


// TRANSACTIONS
Route::prefix('transactions')->group(function () {
    Route::get('/', [TransactionController::class, 'index']);
    Route::post('/', [TransactionController::class, 'store']);
    Route::get('/{id}', [TransactionController::class, 'show']);
    Route::put('/{id}', [TransactionController::class, 'update']);
    Route::delete('/{id}', [TransactionController::class, 'destroy']);
});


// RATINGS
Route::prefix('ratings')->group(function () {
    Route::get('/', [RatingController::class, 'index']);     // CORRIGIDO
    Route::post('/', [RatingController::class, 'store']);
    Route::get('/{id}', [RatingController::class, 'show']);
    Route::put('/{id}', [RatingController::class, 'update']);
    Route::delete('/{id}', [RatingController::class, 'destroy']);
});


// MESSAGES (CHAT)
Route::prefix('messages')->group(function () {
    Route::post('/send', [MessageController::class, 'send']);
    Route::get('/{book_id}/{sender_id}/{receiver_id}', [MessageController::class, 'list']);
});
