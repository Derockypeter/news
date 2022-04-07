<?php

namespace App\Http\Controllers\Api;
use App\Models\Article;
use App\Models\Category;
use App\Http\Resources\ArticleResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return ArticleResource::collection(Article::with('categories')->orderBy('id', 'desc')->paginate(20));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function byCat()
    {
        return ArticleResource::collection(Article::with('categories')->find(1)->get());
    }

    
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'=>'required|max:255',
            'url'=>'required',
            //'viewed'=>'required',
            //'category_id'=>'required'
        ]);

        $title = $request->input('title');
        $url = $request->input('url');
        $cat = $request->input('category_id');
        $lastCharInCat = substr($cat,-1);
        if($lastCharInCat == ')'){//clear error from Nairaland Categorization
            $cat = 'Sports';
        }

        $catExist = Category::where('category', $cat)->first();
        
        $reqArr = [];

        if($catExist == null || $catExist->count() < 1){
            $cat = ucwords(strtolower($cat));
            $catArr = [];
            $catArr['category'] = $cat;
            $cat = Category::create($catArr);
            $catId = $cat->id;
        } elseif($catExist->count() > 0){
            $catId = $catExist->id;
        } 

        $reqArr['title'] = $title;
        $reqArr['url'] = $url;
        $reqArr['viewed'] = 0;
        $reqArr['category_id'] = $catId;
        
        $articleExist = Article::where('title', $title)->first();
        if($articleExist == null || $articleExist->count() < 1){
            $art = Article::create($reqArr);
        } 
        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Article $article)
    {
        return new ArticleResource($article->load('categories'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Article $article)
    {
        /*$request->validate([
            'url'=>'required|max:255',
            'url'=>'required',
            'viewed'=>'required',
            'category_id'=>'required'
        ]);*/

        $article->update($request->all());
        
        //return new ArticleResource($article->load('categories'));
        return ArticleResource::collection(Article::with('categories')->orderBy('id', 'desc')->get());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Article $article)
    {
        $article->delete();

        return response(['message'=>'Article Deleted']);
    }
}
