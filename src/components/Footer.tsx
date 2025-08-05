import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Film, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted border-t">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Branding */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Film className="h-7 w-7" />
              <span className="text-xl font-bold">VX AI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Transforming your text into stunning, high-definition videos with the power of AI.
            </p>
          </div>

          {/* Column 2: Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link></li>
              <li><Link href="/#features" className="text-sm text-muted-foreground hover:text-primary">Features</Link></li>
              <li><Link href="/#gallery" className="text-sm text-muted-foreground hover:text-primary">Inspiration</Link></li>
              <li><Link href="/login" className="text-sm text-muted-foreground hover:text-primary">Sign In</Link></li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          
          {/* Column 4: Legal Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
             <h3 className="font-semibold text-foreground">Stay Updated</h3>
             <p className="text-sm text-muted-foreground mt-2 mb-4">Get the latest news on features and releases.</p>
             <div className="flex w-full max-w-sm items-center space-x-2">
                <Input type="email" placeholder="Enter your email" />
                <Button type="submit" size="icon">
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VX AI. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="#"><Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
            <Link href="#"><Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
            <Link href="#"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}