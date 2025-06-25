# Lecture 03: Laravel Package Development

## 🎯 Learning Objectives

By the end of this lecture, you will understand:
- How to create and structure Laravel packages
- Package service providers and facades
- Package configuration and publishing
- Testing packages
- Package distribution and maintenance
- Composer package management

> 🗣️ بالمصري:
> احنا هنتعلم:
> - ازاي نعمل باكدج للارافيل من الصفر
> - ازاي نعمل الباكدج بطريقة احترافية
> - ازاي نعمل تيست للباكدج
> - ازاي ننشر الباكدج على packagist
> - ازاي نعمل تحديثات للباكدج

## 🌟 Key Concepts Overview

### 1. Package Structure
Understanding the standard Laravel package structure and essential components.

> 🗣️ بالمصري:
> هنتعلم ازاي نرتب ملفات الباكدج بتاعنا:
> - كل ملف يتحط فين
> - ايه الملفات المهمة اللي لازم تكون موجودة
> - ازاي نخلي الباكدج سهل في الاستخدام

```bash
your-package/
├── src/
│   ├── YourPackageServiceProvider.php
│   ├── Facades/
│   └── Services/
├── config/
│   └── your-package.php
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   ├── views/
│   └── lang/
├── tests/
├── composer.json
├── phpunit.xml
└── README.md
```

### 2. Service Providers & Facades

> 🗣️ بالمصري:
> هنتعلم ازاي نعمل:
> - سيرفس بروفايدر للباكدج
> - فاساد عشان نسهل استخدام الباكدج
> - ازاي نربط الباكدج مع لارافيل

```php
// Service Provider
namespace YourVendor\YourPackage;

use Illuminate\Support\ServiceProvider;

class YourPackageServiceProvider extends ServiceProvider {
    public function register() {
        $this->app->singleton('your-package', function ($app) {
            return new YourPackageService();
        });

        $this->mergeConfigFrom(
            __DIR__.'/../config/your-package.php', 'your-package'
        );
    }

    public function boot() {
        $this->publishes([
            __DIR__.'/../config/your-package.php' => config_path('your-package.php'),
            __DIR__.'/../resources/views' => resource_path('views/vendor/your-package'),
        ]);

        $this->loadViewsFrom(__DIR__.'/../resources/views', 'your-package');
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
        $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'your-package');
    }
}

// Facade
namespace YourVendor\YourPackage\Facades;

use Illuminate\Support\Facades\Facade;

class YourPackage extends Facade {
    protected static function getFacadeAccessor() {
        return 'your-package';
    }
}
```

### 3. Package Configuration

> 🗣️ بالمصري:
> هنتعلم ازاي نعمل:
> - ملف كونفيج للباكدج
> - ازاي نخلي المستخدم يقدر يغير في الكونفيج
> - ازاي نحافظ على الكونفيج الديفولت

```php
// config/your-package.php
return [
    'api_key' => env('YOUR_PACKAGE_API_KEY'),
    
    'default_options' => [
        'timeout' => 30,
        'retries' => 3,
    ],
    
    'cache' => [
        'enabled' => true,
        'duration' => 3600,
    ],
];

// Usage in Package
class YourPackageService {
    public function getConfig($key) {
        return config("your-package.{$key}");
    }
    
    public function setTimeout($timeout) {
        config(['your-package.default_options.timeout' => $timeout]);
    }
}
```

### 4. Testing Your Package

> 🗣️ بالمصري:
> هنتعلم ازاي نعمل:
> - تيست للباكدج
> - نتأكد ان كل حاجة شغالة صح
> - نعمل CI/CD للباكدج

```php
namespace YourVendor\YourPackage\Tests;

use Orchestra\Testbench\TestCase;
use YourVendor\YourPackage\YourPackageServiceProvider;

class YourPackageTest extends TestCase {
    protected function getPackageProviders($app) {
        return [YourPackageServiceProvider::class];
    }
    
    /** @test */
    public function it_can_do_something() {
        $result = YourPackage::doSomething();
        $this->assertTrue($result);
    }
    
    /** @test */
    public function it_handles_configuration() {
        $this->assertEquals(
            30,
            config('your-package.default_options.timeout')
        );
    }
}
```

## 🛠 Real-World Examples

### Example 1: Payment Gateway Package

> 🗣️ بالمصري:
> مثال عملي: باكدج للدفع الإلكتروني
> - بيدعم اكتر من بوابة دفع
> - سهل في الاستخدام
> - فيه validation للبيانات

```php
// Payment Gateway Interface
interface PaymentGatewayInterface {
    public function charge(array $data): PaymentResponse;
    public function refund(string $transactionId): RefundResponse;
}

// Stripe Implementation
class StripeGateway implements PaymentGatewayInterface {
    private $stripeClient;
    
    public function __construct(StripeClient $stripeClient) {
        $this->stripeClient = $stripeClient;
    }
    
    public function charge(array $data): PaymentResponse {
        try {
            $charge = $this->stripeClient->charges->create([
                'amount' => $data['amount'],
                'currency' => $data['currency'],
                'source' => $data['token'],
            ]);
            
            return new PaymentResponse(true, $charge->id);
        } catch (Exception $e) {
            return new PaymentResponse(false, null, $e->getMessage());
        }
    }
}

// Facade Usage
Payment::gateway('stripe')->charge([
    'amount' => 1000,
    'currency' => 'USD',
    'token' => 'tok_visa'
]);
```

### Example 2: Social Media Integration Package

> 🗣️ بالمصري:
> مثال تاني: باكدج للسوشيال ميديا
> - بيدعم فيسبوك وتويتر ولينكدان
> - فيه caching للداتا
> - سهل تضيف عليه platforms جديدة

```php
// Social Media Manager
class SocialMediaManager {
    protected $drivers = [];
    
    public function driver($name) {
        if (!isset($this->drivers[$name])) {
            $this->drivers[$name] = $this->createDriver($name);
        }
        
        return $this->drivers[$name];
    }
    
    protected function createDriver($name) {
        $config = config("social-media.drivers.{$name}");
        
        switch ($name) {
            case 'facebook':
                return new FacebookDriver($config);
            case 'twitter':
                return new TwitterDriver($config);
            default:
                throw new InvalidArgumentException("Driver [{$name}] not supported.");
        }
    }
}

// Usage
Social::driver('facebook')->post([
    'message' => 'Hello World!',
    'link' => 'https://example.com'
]);
```

## 🎓 Interview Questions & Answers

> 🗣️ بالمصري:
> اسئلة مهمة هتتسأل عليها في الشغل:

### Q1: What's the difference between register() and boot() in a service provider?
**Answer:**
> 🗣️ بالمصري:
> - register(): بيتنفذ الاول وبنسجل فيه الحاجات اللي محتاجينها
> - boot(): بيتنفذ بعد كل الـ register وبنعمل فيه الsetup النهائي

### Q2: How do you handle package dependencies?
**Answer:**
```json
{
    "name": "vendor/package",
    "require": {
        "php": "^7.4|^8.0",
        "illuminate/support": "^8.0|^9.0"
    },
    "require-dev": {
        "orchestra/testbench": "^6.0",
        "phpunit/phpunit": "^9.0"
    },
    "autoload": {
        "psr-4": {
            "Vendor\\Package\\": "src/"
        }
    }
}
```

### Q3: How do you make your package configurable?
**Answer:**
1. Create config file
2. Register in service provider
3. Publish using `publishes()`
4. Use `mergeConfigFrom()`

## 🏆 Best Practices

> 🗣️ بالمصري:
> نصايح مهمة للشغل:

1. **Follow Laravel Conventions**
> اتبع نفس طريقة لارافيل في كتابة الكود

2. **Write Good Documentation**
> اكتب شرح كويس للباكدج بتاعك

3. **Version Your Package**
> استخدم semantic versioning (major.minor.patch)

4. **Write Tests**
> اكتب تيست لكل feature في الباكدج

## 📚 Additional Resources

- [Laravel Package Development](https://laravel.com/docs/packages)
- [Packagist](https://packagist.org/)
- [Laravel Package Boilerplate](https://laravelpackage.com/)

> 🗣️ بالمصري:
> لو عايز تتعلم اكتر:
> - اقرا الدوكيومنتيشن كويس
> - شوف باكدجات تانية وافهم هي متعملة ازاي
> - جرب تعمل باكدج صغير للتدريب 