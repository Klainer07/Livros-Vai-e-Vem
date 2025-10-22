<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained()->onDelete('cascade'); // vínculo com a transação
            $table->foreignId('rater_id')->constrained('users')->onDelete('cascade'); // quem avalia
            $table->foreignId('rated_user_id')->constrained('users')->onDelete('cascade'); // quem é avaliado
            $table->foreignId('book_id')->nullable()->constrained('books')->onDelete('cascade'); // livro avaliado
            $table->unsignedTinyInteger('score'); // nota de 1 a 5
            $table->text('comment')->nullable(); // comentário opcional
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
