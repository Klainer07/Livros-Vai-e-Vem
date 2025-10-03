<?php

use Illuminate\Support\Facades\Route;

// Rota web padrão
Route::get('/', function () {
    return view('welcome');
});

// Inclui rotas de API
require __DIR__.'/api.php';
