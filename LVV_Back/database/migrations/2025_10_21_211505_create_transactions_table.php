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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained()->onDelete('cascade'); // livro envolvido
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade'); // quem envia o livro
            $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade'); // quem recebe o livro
            $table->enum('type', ['borrow', 'exchange']); // tipo da transação
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending'); // status
            $table->date('start_date')->nullable(); // data de início
            $table->date('end_date')->nullable();   // data de fim
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
