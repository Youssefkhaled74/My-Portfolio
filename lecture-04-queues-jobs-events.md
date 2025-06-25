# Lecture 04: Queues, Jobs & Event-Driven Architecture in Laravel

## 🎯 Learning Objectives

By the end of this lecture, you will understand:
- Queue systems and their importance
- Creating and dispatching jobs
- Event-driven architecture principles
- Handling failed jobs
- Queue workers and supervisors
- Real-time events with Laravel Echo

> 🗣️ بالمصري:
> احنا هنتعلم:
> - ايه هي الـ Queues وليه مهمة
> - ازاي نعمل Jobs ونشغلها
> - ازاي نعمل نظام Events محترف
> - نتعامل مع الـ Jobs اللي بتفشل
> - نشغل Queue Worker ونظبطه
> - نعمل real-time events

## 🌟 Key Concepts Overview

### 1. Understanding Queues

> 🗣️ بالمصري:
> الـ Queue زي طابور في البنك:
> - كل واحد واخد رقم وواقف في الطابور
> - الموظف بيخلص واحد واحد
> - لو حد اتأخر، الباقي مش بيتعطل
> - كل حاجة بتتعمل بالدور

```php
// Basic Job Class
class ProcessPodcast implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    private $podcast;
    
    public function __construct(Podcast $podcast) {
        $this->podcast = $podcast;
    }
    
    public function handle() {
        // Process the podcast...
        $this->podcast->process();
    }
}

// Dispatching a Job
ProcessPodcast::dispatch($podcast);

// Delayed Dispatch
ProcessPodcast::dispatch($podcast)
    ->delay(now()->addMinutes(10));

// Different Queue
ProcessPodcast::dispatch($podcast)
    ->onQueue('processing');
```

### 2. Job Management & Handling

> 🗣️ بالمصري:
> هنتعلم ازاي:
> - نتحكم في الـ Jobs
> - نعمل retry لو حصل error
> - نحط priorities للـ Jobs
> - نعمل cleanup للـ Jobs القديمة

```php
class ProcessVideo implements ShouldQueue {
    public $tries = 3; // Number of retries
    public $timeout = 120; // Seconds
    public $backoff = [60, 120, 180]; // Retry delays
    
    public function handle() {
        try {
            // Process video...
        } catch (Exception $e) {
            $this->release(60); // Release back to queue
        }
    }
    
    public function failed(Exception $e) {
        // Notify team about failure...
        Notification::send(
            $this->user,
            new VideoProcessingFailed($this->video)
        );
    }
}
```

### 3. Event-Driven Architecture

> 🗣️ بالمصري:
> هنتعلم ازاي نعمل:
> - نظام events محترف
> - كل جزء في النظام يعرف يتواصل مع الباقي
> - نفصل الكود بطريقة نضيفة
> - نخلي النظام سهل نزود عليه features

```php
// Event Class
class OrderShipped implements ShouldBroadcast {
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $order;
    
    public function __construct(Order $order) {
        $this->order = $order;
    }
    
    public function broadcastOn() {
        return new PrivateChannel('orders.'.$this->order->id);
    }
}

// Listener Class
class SendShipmentNotification {
    public function handle(OrderShipped $event) {
        $order = $event->order;
        
        // Send notification to customer
        Notification::send(
            $order->customer,
            new OrderShippedNotification($order)
        );
        
        // Update inventory
        $this->updateInventory($order);
    }
}
```

### 4. Real-Time Events with Laravel Echo

> 🗣️ بالمصري:
> هنتعلم ازاي نعمل:
> - تحديثات في real-time
> - نستخدم Pusher او Socket.io
> - نعمل private channels
> - نخلي التطبيق interactive اكتر

```php
// Broadcasting Configuration
return [
    'default' => 'pusher',
    
    'connections' => [
        'pusher' => [
            'driver' => 'pusher',
            'key' => env('PUSHER_APP_KEY'),
            'secret' => env('PUSHER_APP_SECRET'),
            'app_id' => env('PUSHER_APP_ID'),
            'options' => [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'encrypted' => true
            ]
        ]
    ]
];

// Frontend Echo Setup
import Echo from 'laravel-echo';

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    encrypted: true
});

// Listening to Events
Echo.private(`orders.${orderId}`)
    .listen('OrderShipped', (e) => {
        console.log('Order shipped!', e.order);
        updateUI(e.order);
    });
```

## 🛠 Real-World Examples

### Example 1: Video Processing System

> 🗣️ بالمصري:
> مثال عملي: نظام معالجة فيديوهات:
> - بيعالج الفيديوهات في الـ background
> - بيبعت notifications
> - بيعمل retry لو في error
> - بيحفظ الـ logs

```php
class ProcessVideoJob implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    protected $video;
    public $timeout = 3600; // 1 hour
    
    public function __construct(Video $video) {
        $this->video = $video;
    }
    
    public function handle(VideoProcessor $processor) {
        try {
            // Update status
            $this->video->update(['status' => 'processing']);
            
            // Process video
            $result = $processor->process($this->video);
            
            // Update video with processed info
            $this->video->update([
                'status' => 'completed',
                'processed_url' => $result->url,
                'duration' => $result->duration
            ]);
            
            // Dispatch completion event
            event(new VideoProcessed($this->video));
            
        } catch (Exception $e) {
            $this->video->update(['status' => 'failed']);
            throw $e;
        }
    }
    
    public function failed(Exception $e) {
        Log::error('Video processing failed', [
            'video_id' => $this->video->id,
            'error' => $e->getMessage()
        ]);
        
        Notification::send(
            $this->video->user,
            new VideoProcessingFailed($this->video)
        );
    }
}
```

### Example 2: E-commerce Order System

> 🗣️ بالمصري:
> مثال تاني: نظام طلبات لموقع بيع:
> - بيعالج الطلبات في الـ background
> - بيتأكد من المخزون
> - بيبعت emails و SMS
> - بيعمل update للـ analytics

```php
// Order Placed Event
class OrderPlaced implements ShouldBroadcast {
    public $order;
    
    public function __construct(Order $order) {
        $this->order = $order;
    }
    
    public function broadcastOn() {
        return [
            new PrivateChannel('orders'),
            new PrivateChannel('user.'.$this->order->user_id)
        ];
    }
}

// Order Processing Job
class ProcessOrder implements ShouldQueue {
    protected $order;
    
    public function handle() {
        DB::transaction(function () {
            // Check inventory
            $this->checkInventory();
            
            // Process payment
            $this->processPayment();
            
            // Update inventory
            $this->updateInventory();
            
            // Send notifications
            $this->sendNotifications();
            
            // Update analytics
            $this->updateAnalytics();
        });
    }
    
    protected function checkInventory() {
        foreach ($this->order->items as $item) {
            if (!$item->product->hasStock($item->quantity)) {
                throw new InsufficientStockException($item->product);
            }
        }
    }
    
    protected function sendNotifications() {
        // Email confirmation
        Mail::to($this->order->user)
            ->queue(new OrderConfirmation($this->order));
            
        // SMS notification
        if ($this->order->user->phone) {
            SMS::queue(
                $this->order->user->phone,
                "Your order #{$this->order->number} is confirmed!"
            );
        }
    }
}
```

## 🎓 Interview Questions & Answers

> 🗣️ بالمصري:
> اسئلة مهمة هتتسأل عليها في الشغل:

### Q1: What's the difference between sync and async jobs?
**Answer:**
> 🗣️ بالمصري:
> - Sync: بيتنفذ على طول في نفس الوقت (زي لما تستنى في الطابور)
> - Async: بيتنفذ في الـ background (زي لما تاخد رقم وتروح وتيجي)

### Q2: How do you handle failed jobs?
**Answer:**
1. Implement failed() method
2. Set up monitoring
3. Configure retry attempts
4. Log errors properly

### Q3: What are job chains and job batches?
**Answer:**
```php
// Job Chain
Bus::chain([
    new ProcessPayment($order),
    new UpdateInventory($order),
    new SendReceipt($order),
])->dispatch();

// Job Batch
Bus::batch([
    new ProcessImage($image1),
    new ProcessImage($image2),
    new ProcessImage($image3),
])->then(function (Batch $batch) {
    // All jobs completed
})->catch(function (Batch $batch, Throwable $e) {
    // First batch job failure
})->dispatch();
```

## 🏆 Best Practices

> 🗣️ بالمصري:
> نصايح مهمة للشغل:

1. **Always Use Queues for Heavy Tasks**
> حط الشغل الكبير في queue عشان التطبيق ميعلقش

2. **Monitor Your Queues**
> راقب الـ queues عشان تعرف في مشاكل ولا لأ

3. **Handle Failures Gracefully**
> اعمل handling كويس للـ errors

4. **Use Job Middleware When Needed**
> استخدم middleware للـ jobs لو محتاج تعمل حاجة قبل او بعد الـ job

## 📚 Additional Resources

- [Laravel Queues Documentation](https://laravel.com/docs/queues)
- [Laravel Events](https://laravel.com/docs/events)
- [Laravel Horizon](https://laravel.com/docs/horizon)
- [Laravel Broadcasting](https://laravel.com/docs/broadcasting)

> 🗣️ بالمصري:
> لو عايز تتعلم اكتر:
> - اقرا الدوكيومنتيشن كويس
> - جرب Horizon عشان تراقب الـ queues
> - اتعلم Redis عشان هتحتاجه كتير 