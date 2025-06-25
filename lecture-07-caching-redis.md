# Lecture 07: Caching Strategies & Redis Integration

## 🎯 Learning Objectives

By the end of this lecture, you will understand:
- Different caching strategies in Laravel
- Redis integration and configuration
- Cache tags and invalidation
- Rate limiting and throttling
- Session management with Redis
- Real-world caching patterns

> 🗣️ بالمصري:
> احنا هنتعلم:
> - طرق الـ caching المختلفة في لارافيل
> - ازاي نستخدم Redis
> - ازاي نتحكم في الـ cache
> - ازاي نعمل rate limiting
> - نستخدم Redis للـ sessions
> - امثلة عملية للـ caching

## 🌟 Key Concepts Overview

### 1. Caching Basics

> 🗣️ بالمصري:
> هنتعلم الاساسيات:
> - ليه محتاجين caching
> - امتى نستخدم cache
> - انواع الـ cache
> - ازاي نختار النوع المناسب

```php
// Basic Cache Usage
Cache::put('key', 'value', now()->addHours(2));
Cache::get('key', 'default');

// Remember Pattern
$value = Cache::remember('users', 3600, function () {
    return User::all();
});

// Cache Helper
cache(['key' => 'value'], now()->addHours(2));
cache('key'); // Get value

// Forever Cache
Cache::forever('app_version', '1.0.0');
```

### 2. Redis Integration

> 🗣️ بالمصري:
> هنتعلم ازاي نستخدم Redis:
> - نركب Redis ونظبطه
> - نربطه مع لارافيل
> - نستخدمه للـ cache
> - نستخدمه للـ queues

```php
// config/database.php
'redis' => [
    'client' => env('REDIS_CLIENT', 'phpredis'),
    'default' => [
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', 6379),
        'database' => env('REDIS_DB', 0),
    ],
    'cache' => [
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', 6379),
        'database' => env('REDIS_CACHE_DB', 1),
    ],
],

// Using Redis Directly
Redis::set('key', 'value');
Redis::get('key');

// Using Redis for Cache
Cache::store('redis')->put('key', 'value', 3600);
```

### 3. Cache Tags & Invalidation

> 🗣️ بالمصري:
> هنتعلم ازاي:
> - نعمل تاجز للـ cache
> - نمسح cache معين
> - نحدث الـ cache
> - نتعامل مع الـ race conditions

```php
// Using Cache Tags
Cache::tags(['users', 'profile'])->put('user:1', $user, 3600);
Cache::tags(['users'])->get('user:1');

// Invalidating Tagged Cache
Cache::tags(['users'])->flush();

// Atomic Operations
Cache::increment('visits');
Cache::decrement('stock');

// Preventing Race Conditions
Cache::lock('processing')->get(function () {
    // Process that needs to be atomic
});

// Cache Invalidation Strategies
class User extends Model {
    protected static function boot() {
        parent::boot();
        
        static::updated(function ($user) {
            Cache::tags(['users'])->forget("user:{$user->id}");
        });
    }
}
```

### 4. Rate Limiting & Throttling

> 🗣️ بالمصري:
> هنتعلم ازاي:
> - نحدد عدد الريكوستات
> - نمنع الـ spam
> - نعمل throttling للـ API
> - نحمي التطبيق

```php
// Basic Rate Limiting
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/api/posts', function () {
        // Maximum 60 requests per minute
    });
});

// Dynamic Rate Limiting
RateLimiter::for('uploads', function (Request $request) {
    return Limit::perMinute(100)->by($request->user()->id);
});

// Custom Rate Limiter
class CustomRateLimiter {
    public function handle($request, $next) {
        $key = 'login_attempts_'.$request->ip();
        
        $attempts = Redis::get($key) ?? 0;
        
        if ($attempts > 5) {
            throw new TooManyRequestsException;
        }
        
        Redis::incr($key);
        Redis::expire($key, 300); // 5 minutes
        
        return $next($request);
    }
}
```

## 🛠 Real-World Examples

### Example 1: E-commerce Product Catalog

> 🗣️ بالمصري:
> مثال عملي: كاتالوج منتجات:
> - كاش للمنتجات
> - كاش للفلاتر
> - كاش للصور
> - تحديث الكاش اوتوماتيك

```php
class ProductService {
    public function getProducts(array $filters) {
        $cacheKey = 'products:' . md5(serialize($filters));
        
        return Cache::tags(['products'])
            ->remember($cacheKey, now()->addHours(6), function () use ($filters) {
                return Product::query()
                    ->with(['category', 'tags'])
                    ->when($filters['category'] ?? null, function ($query, $category) {
                        $query->whereHas('category', function ($q) use ($category) {
                            $q->where('slug', $category);
                        });
                    })
                    ->when($filters['price_range'] ?? null, function ($query, $range) {
                        $query->whereBetween('price', $range);
                    })
                    ->paginate(20)
                    ->through(function ($product) {
                        $product->image_url = Cache::remember(
                            "product_image:{$product->id}",
                            now()->addDay(),
                            fn() => $this->getOptimizedImageUrl($product)
                        );
                        return $product;
                    });
            });
    }
    
    public function updateProduct(Product $product) {
        DB::transaction(function () use ($product) {
            $product->save();
            
            // Invalidate specific product cache
            Cache::tags(['products'])->forget("product:{$product->id}");
            
            // Invalidate catalog page caches
            Cache::tags(['products'])->flush();
            
            // Queue job to regenerate cache
            RegenerateProductCache::dispatch($product);
        });
    }
}
```

### Example 2: User Activity & Analytics

> 🗣️ بالمصري:
> مثال تاني: نظام تتبع نشاط المستخدمين:
> - نخزن الاحصائيات في Redis
> - نعمل real-time analytics
> - نحفظ اخر نشاط
> - نعمل leaderboard

```php
class UserActivityService {
    public function trackPageView(User $user, $page) {
        $today = now()->format('Y-m-d');
        
        Redis::pipeline(function ($pipe) use ($user, $page, $today) {
            // Increment daily page views
            $pipe->hincrby("stats:pageviews:{$today}", $page, 1);
            
            // Add to user's recent activity
            $pipe->lpush("user:{$user->id}:activity", json_encode([
                'page' => $page,
                'timestamp' => now()->timestamp
            ]));
            
            // Trim activity list to last 100 items
            $pipe->ltrim("user:{$user->id}:activity", 0, 99);
            
            // Update user's score for leaderboard
            $pipe->zincrby('leaderboard:active_users', 1, $user->id);
        });
    }
    
    public function getTopUsers($limit = 10) {
        return Cache::remember('top_users', now()->addMinutes(15), function () use ($limit) {
            $userIds = Redis::zrevrange('leaderboard:active_users', 0, $limit - 1);
            
            return User::whereIn('id', $userIds)
                ->get()
                ->map(function ($user) {
                    $user->score = Redis::zscore('leaderboard:active_users', $user->id);
                    return $user;
                })
                ->sortByDesc('score');
        });
    }
    
    public function getDailyStats() {
        $today = now()->format('Y-m-d');
        $yesterday = now()->subDay()->format('Y-m-d');
        
        return [
            'today' => Redis::hgetall("stats:pageviews:{$today}"),
            'yesterday' => Redis::hgetall("stats:pageviews:{$yesterday}"),
        ];
    }
}
```

## 🎓 Interview Questions & Answers

> 🗣️ بالمصري:
> اسئلة مهمة هتتسأل عليها في الشغل:

### Q1: When should you use Redis over other cache drivers?
**Answer:**
> 🗣️ بالمصري:
> استخدم Redis لما:
> - محتاج performance عالي
> - محتاج تخزن داتا معقدة
> - محتاج features زيادة (مثلاً pub/sub)
> - محتاج persistence للداتا

### Q2: How do you handle cache stampede?
**Answer:**
```php
// Using Atomic Locks
Cache::lock('processing')->get(function () {
    return Cache::remember('key', 3600, function () {
        return expensiveOperation();
    });
});

// Using Beta Distribution
$seconds = 60;
$beta = random_int($seconds * 0.8, $seconds * 1.2);
Cache::put('key', $value, $beta);
```

### Q3: What are cache tags and when to use them?
**Answer:**
> 🗣️ بالمصري:
> Cache tags بتساعدنا:
> - نجمع حاجات مع بعض
> - نمسح مجموعة cache مرة واحدة
> - ننظم الـ cache بطريقة احسن
> - نتحكم في الـ invalidation

## 🏆 Best Practices

> 🗣️ بالمصري:
> نصايح مهمة للشغل:

1. **Cache Invalidation Strategy**
> خطط ازاي هتمسح الـ cache

2. **Use Appropriate TTL**
> حط وقت مناسب للـ cache

3. **Monitor Cache Usage**
> راقب استخدام الـ cache

4. **Use Cache Tags Wisely**
> استخدم الـ tags بذكاء

## 📚 Additional Resources

- [Laravel Cache Documentation](https://laravel.com/docs/cache)
- [Redis Documentation](https://redis.io/documentation)
- [Laravel Redis Documentation](https://laravel.com/docs/redis)
- [Cache Design Patterns](https://redis.com/redis-best-practices/caching-design-patterns/)

> 🗣️ بالمصري:
> لو عايز تتعلم اكتر:
> - اقرا الدوكيومنتيشن بتاع Redis
> - اتعلم caching patterns
> - جرب تعمل مشروع بيستخدم Redis 