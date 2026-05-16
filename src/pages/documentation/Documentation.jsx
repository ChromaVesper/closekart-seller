import React, { useState } from 'react';
import {
  BookOpen,
  Package,
  ShoppingCart,
  BarChart3,
  PlayCircle,
  Settings,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  Zap,
  Shield,
  HelpCircle,
  FileText,
  CheckCircle,
} from 'lucide-react';
import { DashboardLayout } from '../../components/common/DashboardLayout';

const sections = [
  {
    id: 'getting-started',
    icon: Zap,
    color: 'bg-yellow-50 text-yellow-600',
    title: 'Getting Started',
    description: 'Set up your seller account and start selling in minutes.',
    articles: [
      {
        title: 'Creating your Seller Account',
        content:
          'Sign up with your email and business details. Once registered, complete your shop profile including your shop name, address, and contact details. Our team will verify your account within 24 hours.',
      },
      {
        title: 'Setting Up Your Shop Profile',
        content:
          'Navigate to Settings → Shop Profile to add your logo, banner, shop description, and operating hours. A complete profile increases customer trust and conversion.',
      },
      {
        title: 'Understanding the Dashboard',
        content:
          'Your Dashboard gives you a real-time snapshot of total products, orders, revenue, and views. Use the Quick Actions section to add products or upload reels instantly.',
      },
    ],
  },
  {
    id: 'products',
    icon: Package,
    color: 'bg-blue-50 text-blue-600',
    title: 'Managing Products',
    description: 'Add, edit, and manage your product catalogue.',
    articles: [
      {
        title: 'Adding a New Product',
        content:
          'Go to Products → Add Product. Fill in the product name, description, price, category, and upload at least one high-quality image. Click Save to publish it immediately.',
      },
      {
        title: 'Editing & Deleting Products',
        content:
          'Click the ✏️ edit icon on any product card to update details. To remove a product, click the 🗑️ delete icon. Deleted products are permanently removed.',
      },
      {
        title: 'Product Images Best Practices',
        content:
          'Use square images (1:1 ratio) with a minimum resolution of 800×800px. White or neutral backgrounds work best. Upload up to 5 images per product for maximum visibility.',
      },
      {
        title: 'Pricing & Stock Management',
        content:
          'Always keep your prices and stock levels up to date. Products marked as out-of-stock are hidden from customers automatically.',
      },
    ],
  },
  {
    id: 'orders',
    icon: ShoppingCart,
    color: 'bg-green-50 text-green-600',
    title: 'Handling Orders',
    description: 'View, accept, and fulfil customer orders.',
    articles: [
      {
        title: 'Receiving New Orders',
        content:
          'You will receive a notification (and email) when a new order arrives. Head to the Orders page to see the full list. New orders appear at the top with a "Pending" badge.',
      },
      {
        title: 'Updating Order Status',
        content:
          'Use the status dropdown on each order card to mark it as Processing, Shipped, or Delivered. Customers see these updates in real time.',
      },
      {
        title: 'Handling Cancellations & Refunds',
        content:
          'If a customer cancels before shipment, accept the cancellation from the Orders page. Refunds are processed automatically within 5–7 business days by CloseKart.',
      },
    ],
  },
  {
    id: 'reels',
    icon: PlayCircle,
    color: 'bg-purple-50 text-purple-600',
    title: 'Uploading Reels',
    description: 'Create short videos to promote your products.',
    articles: [
      {
        title: 'What are Seller Reels?',
        content:
          'Reels are short vertical videos (up to 60 seconds) that appear in the CloseKart Reels feed. They help customers discover your products in an engaging format.',
      },
      {
        title: 'How to Upload a Reel',
        content:
          'Go to Upload Reel in the sidebar. Select a video file (MP4/MOV, max 100 MB), add a title and product tag, then click Upload. Your reel goes live after passing our content review.',
      },
      {
        title: 'Reel Content Guidelines',
        content:
          'Keep videos between 15–60 seconds. Show your actual product. Avoid copyrighted music. Misleading claims or inappropriate content will result in reel removal.',
      },
    ],
  },
  {
    id: 'analytics',
    icon: BarChart3,
    color: 'bg-orange-50 text-orange-600',
    title: 'Analytics & Insights',
    description: 'Understand your store performance with data.',
    articles: [
      {
        title: 'Reading Your Analytics Dashboard',
        content:
          'The Analytics page shows revenue trends, product views, order conversion rates, and top-performing products over selectable time ranges (7 days, 30 days, 90 days).',
      },
      {
        title: 'Improving Conversion Rate',
        content:
          'High views but low orders often indicate pricing or image quality issues. Review your top-viewed products and A/B test different pricing to find the sweet spot.',
      },
    ],
  },
  {
    id: 'settings',
    icon: Settings,
    color: 'bg-gray-100 text-gray-600',
    title: 'Account & Settings',
    description: 'Manage your account, notifications, and security.',
    articles: [
      {
        title: 'Updating Business Information',
        content:
          'Go to Settings → Profile to update your shop name, description, phone number, and address. Changes take effect immediately.',
      },
      {
        title: 'Notification Preferences',
        content:
          'Toggle email and push notifications for new orders, low stock alerts, and promotional announcements in Settings → Notifications.',
      },
      {
        title: 'Account Security',
        content:
          'We strongly recommend enabling two-factor authentication (2FA) from Settings → Security. Use a strong, unique password and never share your credentials.',
      },
    ],
  },
];

const faqs = [
  {
    q: 'How long does seller verification take?',
    a: 'Verification typically takes 24–48 hours on business days. You will receive an email once your account is approved.',
  },
  {
    q: 'What commission does CloseKart charge?',
    a: 'CloseKart charges a platform fee of 5–10% per order depending on your product category. There are no monthly subscription fees.',
  },
  {
    q: 'Can I sell in multiple locations?',
    a: 'Yes! CloseKart supports multi-location selling. You can configure your delivery radius in Settings → Delivery.',
  },
  {
    q: 'When do I get paid for my orders?',
    a: 'Payments are settled weekly, every Monday, directly to your registered bank account after deducting platform fees.',
  },
  {
    q: 'What file formats are supported for product images?',
    a: 'We support JPG, PNG, and WebP formats. Maximum file size per image is 5 MB.',
  },
  {
    q: 'How do I contact seller support?',
    a: 'Email us at seller-support@closekart.in or use the live chat in the bottom-right corner during business hours (9 AM – 7 PM IST).',
  },
];

const ArticleCard = ({ article }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <CheckCircle size={16} className="text-blue-500 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-800">{article.title}</span>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">
          <p className="pt-4">{article.content}</p>
        </div>
      )}
    </div>
  );
};

const FaqItem = ({ faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <HelpCircle size={16} className="text-purple-500 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-800">{faq.q}</span>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">
          <p className="pt-4">{faq.a}</p>
        </div>
      )}
    </div>
  );
};

export const Documentation = () => {
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState(null);

  const filteredSections = sections
    .map((sec) => ({
      ...sec,
      articles: sec.articles.filter(
        (a) =>
          search === '' ||
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.content.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((sec) => search === '' || sec.articles.length > 0);

  const filteredFaqs = faqs.filter(
    (f) =>
      search === '' ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen size={28} />
          <h1 className="text-3xl font-bold">Seller Documentation</h1>
        </div>
        <p className="text-blue-100 mb-6 max-w-xl">
          Everything you need to set up, manage, and grow your CloseKart store — all in one place.
        </p>
        {/* Search */}
        <div className="relative max-w-lg">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            id="doc-search"
            type="text"
            placeholder="Search articles, FAQs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow"
          />
        </div>
      </div>

      {/* Quick nav chips */}
      {search === '' && (
        <div className="flex flex-wrap gap-2 mb-8">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSection(activeSection === sec.id ? null : sec.id);
                  document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  activeSection === sec.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                <Icon size={14} />
                {sec.title}
              </button>
            );
          })}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-8 mb-10">
        {filteredSections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.id}
              id={sec.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Section Header */}
              <div className="flex items-center gap-4 p-6 border-b border-gray-100">
                <div className={`p-3 rounded-xl ${sec.color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{sec.title}</h2>
                  <p className="text-sm text-gray-500">{sec.description}</p>
                </div>
              </div>
              {/* Articles */}
              <div className="p-6 space-y-3">
                {sec.articles.map((article) => (
                  <ArticleCard key={article.title} article={article} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQs */}
      {filteredFaqs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="flex items-center gap-4 p-6 border-b border-gray-100">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="text-sm text-gray-500">Quick answers to common seller questions.</p>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {filteredFaqs.map((faq) => (
              <FaqItem key={faq.q} faq={faq} />
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {search !== '' && filteredSections.length === 0 && filteredFaqs.length === 0 && (
        <div className="text-center py-20">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No results found</h3>
          <p className="text-gray-500 text-sm">
            Try different keywords or{' '}
            <button
              onClick={() => setSearch('')}
              className="text-blue-600 font-medium hover:underline"
            >
              clear the search
            </button>
            .
          </p>
        </div>
      )}

      {/* Contact Support Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Shield size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Still need help?</p>
            <p className="text-sm text-gray-600">
              Our seller support team is available Mon–Sat, 9 AM – 7 PM IST.
            </p>
          </div>
        </div>
        <a
          href="mailto:seller-support@closekart.in"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
        >
          Contact Support
          <ExternalLink size={16} />
        </a>
      </div>
    </DashboardLayout>
  );
};
