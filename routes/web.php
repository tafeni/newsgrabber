<?php

use App\Http\Controllers\ContentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\WebsiteController;
use App\Http\Controllers\Admin\TopicController;
use App\Http\Controllers\Admin\KeywordController;
use App\Http\Controllers\Admin\ScrapeJobController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::get('/', [ContentController::class, 'index'])->name('home');
Route::get('/content/{page}', [ContentController::class, 'show'])->name('content.show');

// Authentication routes (provided by Breeze)
require __DIR__.'/auth.php';

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    
    // Websites
    Route::resource('websites', WebsiteController::class);
    Route::post('websites/{website}/scrape', [WebsiteController::class, 'scrape'])->name('websites.scrape');
    Route::post('websites/bulk-scrape', [WebsiteController::class, 'bulkScrape'])->name('websites.bulk-scrape');
    
    // Topics
    Route::resource('topics', TopicController::class);
    
    // Keywords
    Route::resource('keywords', KeywordController::class)->only(['store', 'update', 'destroy']);
    
    // Scrape Jobs
    Route::resource('scrape-jobs', ScrapeJobController::class)->only(['index', 'show']);
});
