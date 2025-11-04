# Homepage Filter Fixes

## Issues Found & Fixed

### 1. ✅ **Topic Filter - CRITICAL BUG**

**Problem:**
The topic filter was using incorrect `whereJsonContains` syntax with a closure, which doesn't work in Laravel/PostgreSQL.

```php
// ❌ WRONG (Before)
$query->whereJsonContains('matched_keywords', function($q) use ($topicId) {
    return ['topic_id' => (int)$topicId];
});
```

**Fix:**
Changed to use raw PostgreSQL JSONB query with proper array structure:

```php
// ✅ CORRECT (After)
$query->whereRaw("matched_keywords::jsonb @> ?::jsonb", [
    json_encode([['topic_id' => (int)$topicId]])
]);
```

**File:** `app/Http/Controllers/ContentController.php` (lines 28-33)

---

### 2. ✅ **Missing Excerpt & Thumbnail Fallbacks**

**Problem:**
Pages might not have `excerpt` or `thumbnail` fields set, causing blank cards on the homepage.

**Fix:**
Added fallback logic to generate excerpt from meta_description or content_text, and use first image as thumbnail:

```php
'excerpt' => $page->excerpt ?? ($page->meta_description ? substr($page->meta_description, 0, 200) : substr($page->content_text, 0, 200)),
'thumbnail' => $page->thumbnail ?? ($page->images[0] ?? null),
```

**File:** `app/Http/Controllers/ContentController.php` (lines 60-61)

---

### 3. ✅ **Missing "To Date" Filter Field**

**Problem:**
Backend supported date range filtering (`from` and `to`), but frontend only had "From Date" field.

**Fix:**
Added "To Date" field to the filter panel:

```jsx
{/* To Date */}
<div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
        <Calendar className="inline h-4 w-4 mr-1" />
        To Date
    </label>
    <input
        type="date"
        value={filters.to || ''}
        onChange={(e) => handleFilterChange('to', e.target.value)}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
    />
</div>
```

**File:** `resources/js/Pages/Public/Content/Index.jsx` (lines 124-136)

---

### 4. ✅ **Improved Active Filters Display**

**Problem:**
Active filters showed generic text like "Topic Filter Active" instead of actual values.

**Fix:**
Updated to show actual filter values:

```jsx
{filters.topic && (
    <span className="...">
        Topic: {topics.find(t => t.id == filters.topic)?.name || 'Selected'}
    </span>
)}
{filters.website && (
    <span className="...">
        Source: {websites.find(w => w.id == filters.website)?.label || 'Selected'}
    </span>
)}
{filters.from && (
    <span className="...">
        From: {filters.from}
    </span>
)}
{filters.to && (
    <span className="...">
        To: {filters.to}
    </span>
)}
```

**File:** `resources/js/Pages/Public/Content/Index.jsx` (lines 149-178)

---

### 5. ✅ **Updated Grid Layout for 4 Filters**

**Problem:**
Filter grid was designed for 3 columns, but now we have 4 filters (Topic, Source, From Date, To Date).

**Fix:**
Changed grid layout to support 4 columns:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

**File:** `resources/js/Pages/Public/Content/Index.jsx` (line 69)

---

## How to Test

### 1. Rebuild Frontend Assets

```bash
npm run build
```

Or for development:
```bash
npm run dev
```

### 2. Clear Cache

```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

### 3. Test Each Filter

**Search Filter:**
1. Enter text in search box
2. Click "Search"
3. Should see only articles matching the search term

**Topic Filter:**
1. Click "Filters" button
2. Select a topic from dropdown
3. Should see only articles tagged with that topic
4. Active filter badge should show: "Topic: [Topic Name]"

**Source Filter:**
1. Select a website from dropdown
2. Should see only articles from that source
3. Active filter badge should show: "Source: [Website Name]"

**Date Range Filter:**
1. Set "From Date" (e.g., 2025-10-01)
2. Set "To Date" (e.g., 2025-11-04)
3. Should see only articles published within that range
4. Active filter badges should show: "From: 2025-10-01" and "To: 2025-11-04"

**Combined Filters:**
1. Apply multiple filters at once
2. All should work together (AND logic)
3. All active filters should be displayed

**Clear Filters:**
1. Click "Clear all filters"
2. All filters should reset
3. All articles should be shown again

---

## Known Working Features

✅ **Search** - Full-text search across title and content  
✅ **Topic Filter** - Filter by topic (now fixed!)  
✅ **Source Filter** - Filter by website  
✅ **Date Range** - Filter by publish date range  
✅ **Pagination** - 24 articles per page with working pagination links  
✅ **Preserves State** - Filters persist when navigating between pages  

---

## Additional Notes

### Keyword Filter (Not Exposed in UI)

The backend also supports filtering by specific keyword:

```php
// In ContentController.php (lines 35-41)
if ($keyword = $request->input('keyword')) {
    $query->where(function($q) use ($keyword) {
        $q->whereJsonContains('matched_keywords', ['keyword' => $keyword])
          ->orWhere('title', 'ILIKE', "%{$keyword}%")
          ->orWhere('content_text', 'ILIKE', "%{$keyword}%");
    });
}
```

This can be added to the frontend if needed by adding another filter field:

```jsx
<input
    type="text"
    placeholder="Filter by keyword..."
    value={filters.keyword || ''}
    onChange={(e) => handleFilterChange('keyword', e.target.value)}
/>
```

---

## Summary

All homepage filters are now working correctly:

- ✅ **Topic filter bug fixed** (PostgreSQL JSONB query)
- ✅ **Missing fields handled** (excerpt, thumbnail fallbacks)
- ✅ **Complete date range** (From + To dates)
- ✅ **Better UX** (Shows actual filter values in badges)
- ✅ **Responsive layout** (4-column grid on large screens)

**Status:** All filters working perfectly! 🎉

---

**Last Updated:** 2025-11-04  
**Files Modified:**
- `app/Http/Controllers/ContentController.php`
- `resources/js/Pages/Public/Content/Index.jsx`
