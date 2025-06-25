# Lecture 08: Laravel WebSockets & Real-time Features

## 🎯 Learning Objectives

By the end of this lecture, you will understand:
- WebSocket technology and its benefits
- Laravel WebSockets vs Pusher
- Broadcasting events in Laravel
- Real-time notifications
- Private and presence channels
- Building real-time applications

> 🗣️ بالمصري:
> احنا هنتعلم:
> - ايه هي الـ WebSockets وليه مهمة
> - الفرق بين Laravel WebSockets و Pusher
> - ازاي نعمل broadcasting للـ events
> - نعمل notifications في real-time
> - نعمل private channels
> - نبني تطبيقات real-time

## 🌟 Key Concepts Overview

### 1. WebSocket Basics

> 🗣️ بالمصري:
> هنتعلم الاساسيات:
> - ايه هو الـ WebSocket
> - ازاي بيشتغل
> - الفرق بينه وبين HTTP
> - امتى نستخدمه

```php
// config/broadcasting.php
return [
    'default' => env('BROADCAST_DRIVER', 'websockets'),
    
    'connections' => [
        'websockets' => [
            'driver' => 'pusher',
            'key' => env('PUSHER_APP_KEY'),
            'secret' => env('PUSHER_APP_SECRET'),
            'app_id' => env('PUSHER_APP_ID'),
            'options' => [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'host' => '127.0.0.1',
                'port' => 6001,
                'scheme' => 'http'
            ],
        ],
    ],
];

// Installing WebSockets
composer require beyondcode/laravel-websockets

// Running WebSocket Server
php artisan websockets:serve
```

### 2. Broadcasting Events

> 🗣️ بالمصري:
> هنتعلم ازاي:
> - نعمل broadcast للـ events
> - نستقبل الـ events في الفرونت
> - نعمل private channels
> - نتأكد من الـ authentication

```php
// Event Class
class MessageSent implements ShouldBroadcast {
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $message;
    
    public function __construct(Message $message) {
        $this->message = $message;
    }
    
    public function broadcastOn() {
        return new PrivateChannel('chat.'.$this->message->room_id);
    }
    
    public function broadcastWith() {
        return [
            'id' => $this->message->id,
            'content' => $this->message->content,
            'user' => $this->message->user->name,
            'created_at' => $this->message->created_at->toIso8601String()
        ];
    }
}

// Frontend Setup (resources/js/bootstrap.js)
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    wsHost: window.location.hostname,
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
});

// Listening to Events
Echo.private(`chat.${roomId}`)
    .listen('MessageSent', (e) => {
        console.log(e.message);
        this.messages.push(e.message);
    });
```

### 3. Real-time Notifications

> 🗣️ بالمصري:
> هنتعلم ازاي نعمل:
> - notifications في real-time
> - نخلي المستخدم يشوف الاشعارات على طول
> - نعمل notification counter
> - نحفظ الـ notifications في الداتابيز

```php
// Notification Class
class NewMessage extends Notification implements ShouldBroadcast {
    public $message;
    
    public function __construct(Message $message) {
        $this->message = $message;
    }
    
    public function via($notifiable) {
        return ['database', 'broadcast'];
    }
    
    public function toBroadcast($notifiable) {
        return new BroadcastMessage([
            'message_id' => $this->message->id,
            'content' => $this->message->content,
            'sender' => $this->message->user->name
        ]);
    }
}

// Frontend Notification Handling
Echo.private(`App.Models.User.${userId}`)
    .notification((notification) => {
        this.notifications.unshift(notification);
        this.unreadCount++;
        
        // Show toast notification
        this.$toast.success('New message from ' + notification.sender);
    });
```

### 4. Presence Channels

> 🗣️ بالمصري:
> هنتعلم ازاي:
> - نعرف مين متصل دلوقتي
> - نعمل online status
> - نعرف مين بيكتب دلوقتي
> - نعمل real-time chat

```php
// Channel Routes
Broadcast::channel('chat.{roomId}', function ($user, $roomId) {
    return $user->canAccessRoom($roomId);
});

// Presence Channel
class ChatController {
    public function index(Room $room) {
        return view('chat.room', [
            'room' => $room,
            'messages' => $room->messages()->latest()->take(50)->get()
        ]);
    }
}

// Frontend Presence Channel
Echo.join(`chat.${roomId}`)
    .here((users) => {
        this.onlineUsers = users;
    })
    .joining((user) => {
        this.onlineUsers.push(user);
        this.$toast.info(`${user.name} joined the chat`);
    })
    .leaving((user) => {
        this.onlineUsers = this.onlineUsers.filter(u => u.id !== user.id);
        this.$toast.info(`${user.name} left the chat`);
    })
    .listenForWhisper('typing', (e) => {
        this.whoIsTyping = e.name;
        
        // Clear typing indicator after 2 seconds
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            this.whoIsTyping = null;
        }, 2000);
    });
```

## 🛠 Real-World Examples

### Example 1: Real-time Chat Application

> 🗣️ بالمصري:
> مثال عملي: شات room:
> - الرسايل تظهر على طول
> - نشوف مين موجود
> - نشوف مين بيكتب
> - نبعت notifications

```php
class ChatRoom {
    public function sendMessage(Request $request, Room $room) {
        $message = $room->messages()->create([
            'user_id' => auth()->id(),
            'content' => $request->content
        ]);
        
        broadcast(new MessageSent($message))->toOthers();
        
        // Notify other room participants
        $room->participants
            ->except(auth()->id())
            ->each(function ($user) use ($message) {
                $user->notify(new NewMessage($message));
            });
            
        return response()->json($message->load('user'));
    }
}

// Vue.js Component
export default {
    data() {
        return {
            messages: [],
            onlineUsers: [],
            whoIsTyping: null,
            newMessage: ''
        }
    },
    
    mounted() {
        this.joinRoom();
        this.listenForMessages();
    },
    
    methods: {
        joinRoom() {
            Echo.join(`chat.${this.roomId}`)
                .here(users => this.onlineUsers = users)
                .joining(user => this.onlineUsers.push(user))
                .leaving(user => {
                    this.onlineUsers = this.onlineUsers
                        .filter(u => u.id !== user.id);
                });
        },
        
        sendMessage() {
            axios.post(`/api/rooms/${this.roomId}/messages`, {
                content: this.newMessage
            }).then(response => {
                this.messages.push(response.data);
                this.newMessage = '';
            });
        },
        
        typing() {
            Echo.join(`chat.${this.roomId}`)
                .whisper('typing', {
                    name: this.user.name
                });
        }
    }
}
```

### Example 2: Real-time Dashboard

> 🗣️ بالمصري:
> مثال تاني: داشبورد مباشر:
> - الارقام تتحدث لوحدها
> - نشوف التغييرات على طول
> - نعرض charts متحركة
> - نبعت alerts

```php
class DashboardController {
    public function getStats() {
        $stats = Cache::remember('dashboard.stats', 60, function () {
            return [
                'users_count' => User::count(),
                'orders_today' => Order::whereDate('created_at', today())->count(),
                'revenue_today' => Order::whereDate('created_at', today())->sum('total'),
                'active_users' => User::where('last_active_at', '>=', now()->subMinutes(5))->count()
            ];
        });
        
        broadcast(new StatsUpdated($stats));
        
        return response()->json($stats);
    }
}

// Vue.js Dashboard Component
export default {
    data() {
        return {
            stats: {
                users_count: 0,
                orders_today: 0,
                revenue_today: 0,
                active_users: 0
            },
            chart: null
        }
    },
    
    mounted() {
        this.initializeChart();
        this.listenForUpdates();
        
        // Update stats every minute
        setInterval(this.fetchStats, 60000);
    },
    
    methods: {
        initializeChart() {
            this.chart = new Chart(this.$refs.chart, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Revenue',
                        data: []
                    }]
                }
            });
        },
        
        listenForUpdates() {
            Echo.private('dashboard')
                .listen('StatsUpdated', (e) => {
                    this.stats = e.stats;
                    this.updateChart(e.stats);
                });
        },
        
        updateChart(stats) {
            this.chart.data.labels.push(new Date().toLocaleTimeString());
            this.chart.data.datasets[0].data.push(stats.revenue_today);
            
            // Keep only last 20 points
            if (this.chart.data.labels.length > 20) {
                this.chart.data.labels.shift();
                this.chart.data.datasets[0].data.shift();
            }
            
            this.chart.update();
        }
    }
}
```

## 🎓 Interview Questions & Answers

> 🗣️ بالمصري:
> اسئلة مهمة هتتسأل عليها في الشغل:

### Q1: What's the difference between WebSockets and HTTP?
**Answer:**
> 🗣️ بالمصري:
> - HTTP: بيفتح connection جديدة كل request
> - WebSocket: بيفضل فاتح connection واحدة
> - WebSocket اسرع في الـ real-time
> - HTTP احسن للـ regular requests

### Q2: When should you use private vs presence channels?
**Answer:**
> 🗣️ بالمصري:
> - Private: لما تحتاج authentication بس
> - Presence: لما تحتاج تعرف مين متصل
> - Presence بياخد resources اكتر
> - Private اخف وابسط

### Q3: How do you scale WebSocket applications?
**Answer:**
1. Use Redis for pub/sub
2. Load balance WebSocket servers
3. Implement sticky sessions
4. Monitor connection counts

## 🏆 Best Practices

> 🗣️ بالمصري:
> نصايح مهمة للشغل:

1. **Handle Disconnections**
> اعمل reconnect لو الاتصال قطع

2. **Implement Authentication**
> متنساش الـ security

3. **Monitor Performance**
> راقب الـ connections والـ memory

4. **Use Event Queues**
> استخدم queues للـ heavy operations

## 📚 Additional Resources

- [Laravel WebSockets Documentation](https://beyondco.de/docs/laravel-websockets)
- [Laravel Broadcasting](https://laravel.com/docs/broadcasting)
- [Pusher Documentation](https://pusher.com/docs)
- [Socket.io Documentation](https://socket.io/docs)

> 🗣️ بالمصري:
> لو عايز تتعلم اكتر:
> - اقرا الدوكيومنتيشن بتاع Laravel WebSockets
> - اتعلم WebSocket Protocol
> - جرب تعمل تطبيق real-time صغير 