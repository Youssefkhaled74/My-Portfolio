# Lecture 06: Testing in Laravel (Unit, Feature, Mocking, Static Analysis)

## 🎯 Learning Objectives

By the end of this lecture, you will understand:
- Different types of testing in Laravel
- Writing effective unit tests
- Creating feature tests
- Using mocks and fakes
- Static analysis with PHPStan
- Test-driven development (TDD)

> 🗣️ بالمصري:
> احنا هنتعلم:
> - انواع التيستنج في لارافيل
> - نكتب unit tests كويس
> - نعمل feature tests شاملة
> - نستخدم mocks و fakes
> - نحلل الكود بـ PHPStan
> - نطور بطريقة TDD

## 🌟 Key Concepts Overview

### 1. Unit Testing

> 🗣️ بالمصري:
> هنتعلم ازاي نتيست كل جزء في الكود لوحده:
> - نتأكد ان كل function شغالة صح
> - نتيست الـ business logic
> - نعمل mocking للـ dependencies
> - نكتب تيستات سهل نفهمها

```php
class UserServiceTest extends TestCase {
    /** @test */
    public function it_can_calculate_user_points() {
        // Arrange
        $user = User::factory()->create([
            'orders_count' => 5,
            'total_spent' => 1000
        ]);
        
        $service = new UserService();
        
        // Act
        $points = $service->calculatePoints($user);
        
        // Assert
        $this->assertEquals(150, $points);
    }
    
    /** @test */
    public function it_validates_email_format() {
        $service = new UserService();
        
        $this->assertTrue($service->isValidEmail('test@example.com'));
        $this->assertFalse($service->isValidEmail('invalid-email'));
    }
}
```

### 2. Feature Testing

> 🗣️ بالمصري:
> هنتعلم ازاي نتيست الفيتشرز كاملة:
> - نتيست API endpoints
> - نتيست الـ forms
> - نتيست الـ authentication
> - نتأكد ان كل حاجة شغالة مع بعض

```php
class OrderControllerTest extends TestCase {
    use RefreshDatabase;
    
    /** @test */
    public function user_can_create_order() {
        // Arrange
        $user = User::factory()->create();
        $product = Product::factory()->create(['price' => 100]);
        
        // Act
        $response = $this->actingAs($user)
            ->postJson('/api/orders', [
                'product_id' => $product->id,
                'quantity' => 2
            ]);
            
        // Assert
        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'total' => 200
            ]);
            
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 2
        ]);
    }
    
    /** @test */
    public function it_validates_order_input() {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
            ->postJson('/api/orders', []);
            
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['product_id', 'quantity']);
    }
}
```

### 3. Mocking & Fakes

> 🗣️ بالمصري:
> هنتعلم ازاي نعمل:
> - نقلد السيرفسز الخارجية
> - نتحكم في الـ responses
> - نتيست من غير ما نكلم API حقيقي
> - نتيست الـ error cases

```php
class PaymentServiceTest extends TestCase {
    /** @test */
    public function it_processes_payment_successfully() {
        // Mock the Stripe API
        $stripeMock = $this->mock(StripeClient::class);
        
        $stripeMock->shouldReceive('charges->create')
            ->once()
            ->with([
                'amount' => 1000,
                'currency' => 'usd',
                'source' => 'tok_visa'
            ])
            ->andReturn((object)[
                'id' => 'ch_123',
                'status' => 'succeeded'
            ]);
            
        $paymentService = new PaymentService($stripeMock);
        $result = $paymentService->processPayment(1000, 'tok_visa');
        
        $this->assertTrue($result->success);
        $this->assertEquals('ch_123', $result->transactionId);
    }
    
    /** @test */
    public function it_handles_failed_payments() {
        $stripeMock = $this->mock(StripeClient::class);
        
        $stripeMock->shouldReceive('charges->create')
            ->andThrow(new Exception('Insufficient funds'));
            
        $paymentService = new PaymentService($stripeMock);
        $result = $paymentService->processPayment(1000, 'tok_visa');
        
        $this->assertFalse($result->success);
        $this->assertEquals('Insufficient funds', $result->error);
    }
}

// Testing Mail
class OrderTest extends TestCase {
    /** @test */
    public function it_sends_order_confirmation_email() {
        Mail::fake();
        
        $order = Order::factory()->create();
        
        // Trigger the order process
        $order->process();
        
        Mail::assertSent(OrderConfirmation::class, function ($mail) use ($order) {
            return $mail->order->id === $order->id;
        });
    }
}
```

### 4. Static Analysis with PHPStan

> 🗣️ بالمصري:
> هنتعلم ازاي نحلل الكود:
> - نلاقي الـ bugs قبل ما تظهر
> - نتأكد ان الكود نضيف
> - نحسن جودة الكود
> - نمنع المشاكل قبل ما تحصل

```php
// phpstan.neon
parameters:
    level: 8
    paths:
        - app
        - tests
    excludePaths:
        - vendor
    checkMissingIterableValueType: false
    
// Running PHPStan
./vendor/bin/phpstan analyse

// Example Issues PHPStan Catches
class UserService {
    public function getUser($id): User {
        $user = User::find($id);
        return $user; // PHPStan: Method may return null
    }
    
    // Fixed Version
    public function getUser($id): ?User {
        return User::find($id);
    }
}
```

## 🛠 Real-World Examples

### Example 1: E-commerce Order Process

> 🗣️ بالمصري:
> مثال عملي: تيست نظام الطلبات:
> - نتيست عملية الطلب كاملة
> - نتيست الدفع
> - نتيست الـ inventory
> - نتيست الـ notifications

```php
class OrderProcessTest extends TestCase {
    use RefreshDatabase;
    
    /** @test */
    public function complete_order_process() {
        // Arrange
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'price' => 100,
            'stock' => 5
        ]);
        
        // Mock Payment Gateway
        $this->mock(PaymentGateway::class, function ($mock) {
            $mock->shouldReceive('charge')
                ->once()
                ->andReturn([
                    'success' => true,
                    'transaction_id' => 'tx_123'
                ]);
        });
        
        // Mock Notifications
        Notification::fake();
        Mail::fake();
        
        // Act
        $response = $this->actingAs($user)
            ->postJson('/api/orders', [
                'product_id' => $product->id,
                'quantity' => 2,
                'payment_token' => 'tok_visa'
            ]);
            
        // Assert
        $response->assertStatus(201);
        
        // Check Database
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'total' => 200
        ]);
        
        // Check Stock Updated
        $this->assertEquals(3, $product->fresh()->stock);
        
        // Check Notifications
        Notification::assertSentTo($user, OrderConfirmation::class);
        Mail::assertSent(OrderReceipt::class);
    }
}
```

### Example 2: Authentication System

> 🗣️ بالمصري:
> مثال تاني: تيست نظام الـ authentication:
> - نتيست الـ login
> - نتيست الـ registration
> - نتيست الـ password reset
> - نتيست الـ social login

```php
class AuthenticationTest extends TestCase {
    use RefreshDatabase;
    
    /** @test */
    public function user_can_login_with_correct_credentials() {
        // Arrange
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123')
        ]);
        
        // Act
        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);
        
        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'success' => true
            ])
            ->assertCookie('token');
            
        $this->assertAuthenticatedAs($user);
    }
    
    /** @test */
    public function user_cannot_login_with_invalid_credentials() {
        // Arrange
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123')
        ]);
        
        // Act
        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'wrong_password'
        ]);
        
        // Assert
        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid credentials'
            ]);
            
        $this->assertGuest();
    }
    
    /** @test */
    public function user_can_reset_password() {
        // Arrange
        $user = User::factory()->create();
        Password::shouldReceive('sendResetLink')
            ->once()
            ->andReturn(Password::RESET_LINK_SENT);
            
        // Act
        $response = $this->postJson('/api/password/reset', [
            'email' => $user->email
        ]);
        
        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Reset link sent'
            ]);
    }
}
```

## 🎓 Interview Questions & Answers

> 🗣️ بالمصري:
> اسئلة مهمة هتتسأل عليها في الشغل:

### Q1: What's the difference between Unit and Feature tests?
**Answer:**
> 🗣️ بالمصري:
> - Unit tests: بتتيست جزء صغير من الكود لوحده
> - Feature tests: بتتيست فيتشر كاملة مع كل حاجاتها

### Q2: How do you handle external services in tests?
**Answer:**
1. Use Mocking
2. Use Laravel's Fake facades
3. Create test doubles
4. Use dependency injection

### Q3: What is Test-Driven Development (TDD)?
**Answer:**
> 🗣️ بالمصري:
> TDD يعني:
> 1. اكتب التيست الاول
> 2. شوف التيست فشل
> 3. اكتب الكود
> 4. شوف التيست نجح
> 5. حسن الكود

## 🏆 Best Practices

> 🗣️ بالمصري:
> نصايح مهمة للشغل:

1. **Write Tests First**
> اكتب التيست قبل الكود

2. **Keep Tests Clean**
> خلي التيستات نضيفة وسهل حد تاني يفهمها

3. **Test Edge Cases**
> اتيست الحالات الغريبة والـ errors

4. **Use Meaningful Names**
> سمي التيستات اسامي تفهم منها هي بتتيست ايه

## 📚 Additional Resources

- [Laravel Testing Documentation](https://laravel.com/docs/testing)
- [PHPUnit Documentation](https://phpunit.de/documentation.html)
- [PHPStan Documentation](https://phpstan.org/user-guide/getting-started)
- [Mockery Documentation](http://docs.mockery.io/en/latest/)

> 🗣️ بالمصري:
> لو عايز تتعلم اكتر:
> - اقرا الدوكيومنتيشن بتاع Testing في لارافيل
> - اتعلم PHPUnit كويس
> - جرب تكتب تيستات لمشروع صغير 