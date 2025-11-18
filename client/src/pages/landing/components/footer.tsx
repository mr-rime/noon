import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { FooterBanner } from '@/components/banners/banner-display'

export default function Footer() {
    return (
        <>
            <div className="mt-16 mb-8 px-4">
                <FooterBanner className="max-w-6xl mx-auto" />
            </div>

            <footer className="bg-white text-gray-900">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                        <div>
                            <h3 className="text-xl font-bold mb-4">Company</h3>
                            <div className="space-y-2">
                                <p className="text-gray-600 text-sm">About Us</p>
                                <p className="text-gray-600 text-sm">Careers</p>
                                <p className="text-gray-600 text-sm">Press</p>
                                <p className="text-gray-600 text-sm">Blog</p>
                                <p className="text-gray-600 text-sm">Gift Cards</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4">Customer Service</h3>
                            <div className="space-y-2">
                                <p className="text-gray-600 text-sm">Help Center</p>
                                <p className="text-gray-600 text-sm">Track Order</p>
                                <p className="text-gray-600 text-sm">Returns & Refunds</p>
                                <p className="text-gray-600 text-sm">Shipping Info</p>
                                <p className="text-gray-600 text-sm">Contact Us</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4">Policies</h3>
                            <div className="space-y-2">
                                <p className="text-gray-600 text-sm">Privacy Policy</p>
                                <p className="text-gray-600 text-sm">Terms of Service</p>
                                <p className="text-gray-600 text-sm">Cookie Policy</p>
                                <p className="text-gray-600 text-sm">Accessibility</p>
                                <p className="text-gray-600 text-sm">Sitemap</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Mail size={16} className="text-gray-500" />
                                    <p className="text-gray-600 text-sm">support@company.com</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone size={16} className="text-gray-500" />
                                    <p className="text-gray-600 text-sm">1-800-123-4567</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPin size={16} className="text-gray-500" />
                                    <p className="text-gray-600 text-sm">123 Street, City, State</p>
                                </div>

                                <div className="flex space-x-4 mt-4">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 cursor-pointer transition-colors">
                                        <Facebook size={16} />
                                    </div>
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 cursor-pointer transition-colors">
                                        <Twitter size={16} />
                                    </div>
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 cursor-pointer transition-colors">
                                        <Instagram size={16} />
                                    </div>
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 cursor-pointer transition-colors">
                                        <Youtube size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0">
                                <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
                                <p className="text-gray-900 text-sm">Subscribe to our newsletter for exclusive offers</p>
                            </div>
                            <div className="flex space-x-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                />
                                <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#F3F4F8] border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="text-gray-600 text-sm mb-2 md:mb-0">
                                &copy; 2024 Your Company. All rights reserved.
                            </div>
                            <div className="flex space-x-6 text-gray-600 text-sm">
                                <p>Payment Methods</p>
                                <p>Shipping Partners</p>
                                <p>Secure Shopping</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
