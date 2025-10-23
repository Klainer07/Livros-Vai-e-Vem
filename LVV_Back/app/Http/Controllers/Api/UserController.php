<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{

    // Listar todos os usuários
    public function index()
    {
        $users = User::all();
        return response()->json($users, 200);
    }

    // Criar novo usuário
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'nullable|string|max:50|unique:users',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'avatar' => 'nullable|url',
            'bio' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'avatar' => $request->avatar,
            'bio' => $request->bio,
        ]);

        return response()->json($user, 201);
    }

    // Mostrar detalhes de um usuário
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        return response()->json($user, 200);
    }

    // Atualizar usuário
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'username' => ['nullable', 'string', 'max:50', Rule::unique('users')->ignore($user->id)],
            'email' => ['sometimes','required','email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'avatar' => 'nullable|url',
            'bio' => 'nullable|string',
        ]);

        $user->name = $request->name ?? $user->name;
        $user->username = $request->username ?? $user->username;
        $user->email = $request->email ?? $user->email;
        $user->avatar = $request->avatar ?? $user->avatar;
        $user->bio = $request->bio ?? $user->bio;

        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json($user, 200);
    }

    // Deletar usuário
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'Usuário deletado com sucesso'], 200);
    }


    // Login do usuário (gera token)
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciais inválidas'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    // Logout do usuário (revoga token atual)
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout realizado com sucesso']);
    }

    // Retorna dados do usuário autenticado
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
