# Lecture 05: Laravel Octane & Performance Optimization

---

## 🗺️ Study Roadmap

**How to get the most out of this lecture:**

1. Read each section carefully, focusing on both the English and Egyptian Arabic explanations.
2. Try the hands-on practice tasks after each concept.
3. Check the 'Common Mistakes' to avoid typical errors.
4. Use the 'Quick Recap' to review key points.
5. Test yourself with the 'Self-Quiz' after each section.
6. Relate the 'Real-World Scenario' to your own projects.
7. At the end, use the 'Study Checklist' to make sure you covered everything.

> 🗣️ بالمصري:
> - اقرا كل جزء كويس بالانجليزي وبالمصري.
> - جرب كل تمرين عملي بنفسك.
> - خد بالك من الأخطاء الشائعة.
> - راجع الملخص السريع بعد كل جزء.
> - اختبر نفسك بالأسئلة.
> - اربط السيناريوهات العملية بشغلك.
> - في الآخر، راجع checklist المذاكرة.

---

## 🎯 Learning Objectives

By the end of this lecture, you will understand:
- Laravel Octane and its benefits
- Application performance optimization techniques
- Memory management and leak prevention
- Database query optimization
- Server configuration best practices
- Monitoring and profiling tools

> 🗣️ بالمصري:
> احنا هنتعلم:
> - ايه هو Laravel Octane وليه مهم
> - ازاي نخلي التطبيق اسرع
> - ازاي نتحكم في الميموري
> - ازاي نحسن الـ queries بتاعت الداتابيز
> - ازاي نظبط السيرفر
> - ازاي نراقب اداء التطبيق

## 🌟 Key Concepts Overview

### 1. Laravel Octane Basics

#### 📖 How to Study This Section
> 🗣️ بالمصري:
> - اقرا الشرح كويس وفهم كل نقطة.
> - جرب تشغل Octane بنفسك على مشروع Laravel عندك.
> - لاحظ الفرق في السرعة بين Octane وبدونه.
> - لو حاجة مش واضحة، دور عليها في الدوكيومنتيشن أو اسأل حد من زمايلك.

#### 🛠️ How to Practice
- Install Octane in a test Laravel project.
- Run benchmarks with and without Octane.
- Try changing the number of workers and see the effect.

> 🗣️ بالمصري:
> - نزل Octane وجربه بنفسك.
> - شوف التطبيق كان بياخد وقت قد ايه قبل وبعد.
> - جرب تزود وتقلل عدد الـ workers وشوف ايه اللي بيحصل.

#### ⚠️ Common Mistakes & How to Avoid
- Forgetting to clear cache between runs.
- Not monitoring memory usage.

> 🗣️ بالمصري:
> - متنساش تمسح الكاش وانت بتجرب.
> - تابع استهلاك الميموري عشان متحصلش مشاكل.

#### 🔄 Quick Recap
- Octane keeps your app in memory for faster requests.
- Supports RoadRunner and Swoole.
- Needs careful memory management.

> 🗣️ بالمصري:
> - Octane بيخلي الابلكيشن اسرع بكتير.
> - لازم تتابع الميموري كويس.

#### ❓ Self-Quiz
1. What does Octane do to improve performance?
2. Name two servers Octane supports.

#### 🧑‍💻 Real-World Scenario
> 🗣️ بالمصري:
> احمد كان عنده ابلكيشن بطيء. لما جرب Octane، الابلكيشن بقى اسرع ٣ مرات، بس لاحظ ان الميموري زادت، فبدأ يراقبها كويس.

```php
// config/octane.php
return [
    'server' => env('OCTANE_SERVER', 'roadrunner'),
    
    'https' => env('OCTANE_HTTPS', false),
    
    'workers' => env('OCTANE_WORKERS', 2),
    
    'warm' => [
        // Services to pre-load
        \App\Providers\RouteServiceProvider::class,
    ],
    
    'listeners' => [
        'workerStarting' => [
            function () {
                // Initialize on worker start
                cache()->clear();
            },
        ],
    ],
];

// Starting Octane
php artisan octane:start --workers=4 --task-workers=2
```

### 2. Query Optimization

#### 📖 How to Study This Section
> 🗣️ بالمصري:
> - افهم يعني ايه N+1 problem وازاي تحلها.
> - جرب تكتب queries بنفسك وشوف الفرق بين السيء والمظبوط.
> - جرب تستخدم الـ indexes في الداتابيز.

#### 🛠️ How to Practice
- Write a query with and without eager loading and compare the number of queries.
- Add indexes to a table and measure query speed.
- Use chunking for large data and observe memory usage.

> 🗣️ بالمصري:
> - جرب تعمل query فيها N+1 وشوف المشكلة.
> - بعدين استخدم with() وشوف الفرق.
> - ضيف index على عمود وجرب السرعة.

#### ⚠️ Common Mistakes & How to Avoid
- Loading all columns when only a few are needed.
- Not using eager loading, causing N+1 problems.
- Forgetting to use indexes on frequently searched columns.

> 🗣️ بالمصري:
> - متجبش كل الأعمدة لو مش محتاجها.
> - استخدم with() عشان تحل مشكلة N+1.
> - متنساش تعمل index على الأعمدة المهمة.

#### 🔄 Quick Recap
- Use select() to limit columns.
- Use with() for eager loading.
- Add indexes for faster queries.
- Use chunking for large datasets.

> 🗣️ بالمصري:
> - استخدم select() و with() و index.
> - chunk مفيدة للبيانات الكتير.

#### ❓ Self-Quiz
1. What is the N+1 problem?
2. How do you solve it in Laravel?
3. Why are indexes important?

#### 🧑‍💻 Real-World Scenario
> 🗣️ بالمصري:
> فاطمة كانت بتجيب بيانات المستخدمين وكل مرة بتعمل query جديدة للبروفايل. لما استخدمت with() السرعة زادت والمشكلة اتحلت.

```php
// Bad Query
$users = User::all(); // Gets all columns
foreach ($users as $user) {
    echo $user->profile->name; // N+1 Problem
}

// Optimized Query
$users = User::select(['id', 'name', 'email'])
    ->with(['profile' => function ($query) {
        $query->select(['user_id', 'name']);
    }])
    ->whereHas('orders')
    ->get();

// Using Database Indexes
Schema::table('users', function (Blueprint $table) {
    $table->index(['email', 'status']);
    $table->index('last_login_at');
});

// Chunk Processing for Large Datasets
User::chunk(1000, function ($users) {
    foreach ($users as $user) {
        ProcessUser::dispatch($user);
    }
});
```

### 3. Memory Management

#### 📖 How to Study This Section
> 🗣️ بالمصري:
> - افهم يعني ايه memory leak وازاي تتجنبه.
> - جرب تعالج بيانات كتير وشوف استهلاك الميموري.
> - استخدم chunk و generator في الكود.

#### 🛠️ How to Practice
- Process a large dataset with and without chunking.
- Use unset() and garbage collection in your code.
- Export a large file using a generator.

> 🗣️ بالمصري:
> - جرب تعالج بيانات كتير مرة واحدة ومرة بـ chunk.
> - استخدم unset() وشوف الفرق في الميموري.
> - جرب تكتب generator بنفسك.

#### ⚠️ Common Mistakes & How to Avoid
- Keeping unnecessary data in memory.
- Not using chunking for large datasets.
- Ignoring garbage collection.

> 🗣️ بالمصري:
> - متخليش الداتا تفضل في الميموري وانت مش محتاجها.
> - chunk مهمة للبيانات الكتير.
> - لو الميموري زادت قوي، جرب gc_collect_cycles().

#### 🔄 Quick Recap
- Use chunking and generators for large data.
- Always clear unused data from memory.
- Monitor memory usage.

> 🗣️ بالمصري:
> - chunk و generator بيقللوا استهلاك الميموري.
> - امسح الداتا اللي مش محتاجها.

#### ❓ Self-Quiz
1. What is a memory leak?
2. How does chunking help with memory?
3. How do you clear memory in PHP?

#### 🧑‍💻 Real-World Scenario
> 🗣️ بالمصري:
> كريم كان بيعالج مليون يوزر مرة واحدة، السيرفر وقع. لما استخدم chunk و unset()، العملية بقت اسهل والميموري قلت.

```php
class LargeDataProcessor {
    public function process() {
        // Process in chunks to manage memory
        User::chunk(1000, function ($users) {
            foreach ($users as $user) {
                $this->processUser($user);
                
                // Clear model from memory
                unset($user);
            }
            
            // Clear query log
            DB::getQueryLog();
            
            // Garbage collection
            if (function_exists('gc_collect_cycles')) {
                gc_collect_cycles();
            }
        });
    }
}

// Using Generator for Memory Efficiency
public function exportLargeFile() {
    $handle = fopen('large-file.csv', 'w');
    
    User::chunk(1000, function ($users) use ($handle) {
        foreach ($users as $user) {
            fputcsv($handle, [
                $user->id,
                $user->name,
                $user->email
            ]);
        }
    });
    
    fclose($handle);
}
```

### 4. Server Configuration

#### 📖 How to Study This Section
> 🗣️ بالمصري:
> - افهم كل إعداد في php.ini و nginx.conf.
> - جرب تغير الإعدادات وشوف تأثيرها.
> - اعرف يعني ايه OPcache وازاي يفيدك.

#### 🛠️ How to Practice
- Change memory_limit and observe the effect.
- Enable OPcache and benchmark your app.
- Adjust Nginx worker settings and test concurrency.

> 🗣️ بالمصري:
> - غير memory_limit وجرب.
> - فعل OPcache وشوف السرعة.
> - زود worker_connections في Nginx وجرب.

#### ⚠️ Common Mistakes & How to Avoid
- Setting memory_limit too low or too high.
- Not enabling OPcache.
- Not tuning web server for high traffic.

> 🗣️ بالمصري:
> - memory_limit لو قليل التطبيق هيقع، لو كبير ممكن يستهلك كل الرام.
> - فعل OPcache دايمًا.
> - ظبط إعدادات السيرفر حسب الترافيك.

#### 🔄 Quick Recap
- Tune PHP and web server settings for best performance.
- Always enable OPcache.
- Monitor server resources.

> 🗣️ بالمصري:
> - ظبط إعدادات PHP والسيرفر.
> - فعل OPcache.
> - راقب استهلاك السيرفر.

#### ❓ Self-Quiz
1. What does OPcache do?
2. Why is memory_limit important?
3. How do you increase concurrency in Nginx?

#### 🧑‍💻 Real-World Scenario
> 🗣️ بالمصري:
> ياسر كان عنده ترافيك عالي، السيرفر كان بيقع. لما ظبط إعدادات Nginx و PHP، الأداء اتحسن والتطبيق بقى ثابت.

```ini
; php.ini Optimization
memory_limit = 512M
max_execution_time = 60
opcache.enable=1
opcache.memory_consumption=512
opcache.interned_strings_buffer=64
opcache.max_accelerated_files=32531
opcache.validate_timestamps=0
opcache.save_comments=1
opcache.fast_shutdown=0

; nginx.conf
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 65535;
    multi_accept on;
    use epoll;
}

http {
    keepalive_timeout 65;
    keepalive_requests 100;
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
}
```

## 🛠 Real-World Examples

### Example 1: E-commerce Product Catalog

> 🗣️ بالمصري:
> مثال عملي: كاتالوج منتجات:
> - فيه عدد كبير من المنتجات
> - محتاج يكون سريع في البحث
> - فيه فلترة وسورت
> - بيستخدم caching

```php
class ProductController {
    public function index(Request $request) {
        $cacheKey = "products:{$request->category}:{$request->sort}:{$request->page}";
        
        return cache()->remember($cacheKey, now()->addHours(1), function () use ($request) {
            return Product::select(['id', 'name', 'price', 'thumbnail'])
                ->with(['category:id,name', 'tags:id,name'])
                ->when($request->category, function ($query, $category) {
                    $query->whereHas('category', function ($q) use ($category) {
                        $q->where('slug', $category);
                    });
                })
                ->when($request->sort, function ($query, $sort) {
                    match ($sort) {
                        'price_asc' => $query->orderBy('price'),
                        'price_desc' => $query->orderBy('price', 'desc'),
                        'newest' => $query->latest(),
                        default => $query->orderBy('name')
                    };
                })
                ->paginate(24)
                ->withQueryString();
        });
    }
}
```

### Example 2: Analytics Dashboard

> 🗣️ بالمصري:
> مثال تاني: داشبورد للاحصائيات:
> - بيجمع داتا كتير
> - محتاج يكون real-time
> - فيه عمليات حسابية معقدة
> - بيستخدم caching و queues

```php
class DashboardService {
    public function getStatistics() {
        return cache()->remember('dashboard:stats', now()->addMinutes(5), function () {
            return [
                'sales' => $this->getSalesStats(),
                'users' => $this->getUserStats(),
                'products' => $this->getProductStats(),
            ];
        });
    }
    
    protected function getSalesStats() {
        return DB::table('orders')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total) as total')
            )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');
    }
    
    protected function processLargeDataset() {
        $result = collect();
        
        User::with('orders')
            ->lazyById(1000)
            ->each(function ($user) use ($result) {
                $result->push($this->calculateUserMetrics($user));
            });
            
        return $result;
    }
}
```

## 🎓 Interview Questions & Answers

> 🗣️ بالمصري:
> اسئلة مهمة هتتسأل عليها في الشغل:

### Q1: What are the benefits of using Laravel Octane?
**Answer:**
> 🗣️ بالمصري:
> - بيخلي التطبيق اسرع 2x-3x
> - بيحمل الكود مرة واحدة بس
> - بيشغل اكتر من request في نفس الوقت
> - بيقلل استهلاك الميموري

### Q2: How do you handle N+1 query problems?
**Answer:**
1. Use eager loading with `with()`
2. Use lazy eager loading when needed
3. Use select() to limit columns
4. Use database indexes properly

### Q3: What are the best practices for caching in Laravel?
**Answer:**
```php
// Using Cache Tags
Cache::tags(['users', 'profile'])->put('user:1', $user, 3600);

// Using Remember
$value = Cache::remember('key', 3600, function () {
    return DB::table(...)->get();
});

// Cache Invalidation
Cache::tags(['users'])->flush();
```

## 🏆 Best Practices

> 🗣️ بالمصري:
> نصايح مهمة للشغل:

1. **Always Monitor Performance**
> راقب اداء التطبيق باستمرار

2. **Use Proper Indexes**
> استخدم الـ indexes المناسبة في الداتابيز

3. **Cache Wisely**
> استخدم الـ cache بذكاء وحدد وقت صلاحية مناسب

4. **Optimize Assets**
> اضغط الصور والـ CSS والـ JavaScript

## 📚 Additional Resources

- [Laravel Octane Documentation](https://laravel.com/docs/octane)
- [Database Indexing Strategies](https://laravel.com/docs/queries)
- [Laravel Performance Tips](https://laravel.com/docs/deployment)
- [Server Configuration Guide](https://laravel.com/docs/deployment#server-requirements)

> 🗣️ بالمصري:
> لو عايز تتعلم اكتر:
> - اقرا الدوكيومنتيشن بتاع Octane
> - اتعلم ازاي تعمل profiling للتطبيق
> - اتعلم ازاي تظبط السيرفر

## 🏁 Study Checklist

- [ ] قرأت كل جزء وفهمته بالانجليزي وبالمصري
- [ ] جربت كل تمرين عملي
- [ ] راجعت الأخطاء الشائعة
- [ ] عملت ملخص سريع لكل جزء
- [ ] جاوبت على كل الأسئلة
- [ ] فهمت السيناريوهات العملية
- [ ] جاهز تطبق الكلام ده في شغلك

## 📝 Self-Quiz Answers

### Laravel Octane Basics
1. Octane keeps the app in memory for faster requests and supports concurrent requests.
2. RoadRunner and Swoole.

### Query Optimization
1. N+1 problem is when each item in a result set triggers an additional query, causing performance issues.
2. Use eager loading with with().
3. Indexes make queries faster by allowing the database to find data more efficiently.

### Memory Management
1. Memory leak is when memory is used but not released, causing the app to consume more and more RAM.
2. Chunking processes data in small pieces, reducing memory usage.
3. Use unset() and gc_collect_cycles() to clear memory in PHP.

### Server Configuration
1. OPcache caches compiled PHP code in memory for faster execution.
2. memory_limit controls how much RAM a PHP script can use.
3. Increase worker_connections and worker_processes in Nginx.

// ... existing code ... 