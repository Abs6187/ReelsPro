"use client";

import { ReviewCard } from "./components/ReviewCard";
import { reviews } from "@/data/reviews";
import { Marquee } from "@/components/magicui/marquee";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"; // Make sure you have these components
import Link from "next/link";
import { faqData } from "@/data/faqData";
import { features } from "@/data/features";
import { teamData, futureIntegrations } from "@/data/teamData";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

export default function LandingPage() {
 

  return (
    <div className="font-sans antialiased max-w-7xl mx-auto px-4 bg-black dark:bg-gray-900">

    {/* Hero Section with Full-Width Background Image */}
    <section 
      className="relative bg-no-repeat bg-center pt-20  px-6 md:px-20 items-center justify-center" 
      style={{ backgroundImage: "url('https://images.pexels.com/photos/1595232/pexels-photo-1595232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60 backdrop-blur-md"></div> {/* Gradient + Blur Effect */}
      <div className="relative z-10 text-center text-white py-32 md:py-48 px-6">
        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate__animated animate__fadeIn animate__delay-1s">
          Welcome to Reels<span className="text-blue-700">Pro</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 animate__animated animate__fadeIn animate__delay-1.5s">
          Explore handpicked videos across different genres.
        </p>
        <p className="text-xl md:text-2xl mb-8 animate__animated animate__fadeIn animate__delay-1.5s">
          We are very excited to have you join our community of video enthusiasts.
        </p>

        {/* Get Started Button */}
        <Link href='/register'>
        
        <button 
          className="  px-6 py-3 rounded-full text-2xl font-bold hover:scale-105 transform transition-all duration-300 ease-in-out shadow-xl"
        >
          Get Started
        </button>
        </Link>
      </div>
    </section>


      {/* Features Section with Images */}
      <section className="bg-black text-white py-16">
        <div className="container px-8 text-center">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Our Features</h2>
            <p className="text-lg mt-4">Discover what makes ReelsPro stand out from the crowd.</p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-rounded-xl p-6 transition duration-300 ease-in-out">
                {/* Feature Icon */}
                <div className="flex items-center justify-center bg-blue-700 text-white p-4 rounded-full w-16 h-16 mb-6 mx-auto">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold text-center">{feature.name}</h3>
                <p className="mt-4 text-center text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Image Background */}
      <section className="bg-black  text-white py-20">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-8">What Our Users Say</h2>
        </div>
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black"></div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 sm:px-20 bg-black text-white">
        <div className="container text-center mb-12">
          <h2 className="text-4xl font-bold">About Us</h2>
          <p className="text-lg mt-4">Learn more about who we are and what drives us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center justify-center">
          {/* Left Column (Text) */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
            <p className="text-lg mb-6">
              At ReelsPro, we are dedicated to providing a platform where people can explore a wide range of high-quality, handpicked videos across various genres. Our mission is to inspire and entertain, allowing everyone to discover content that resonates with them.
            </p>
            <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
            <p className="text-lg">
              We envision a world where entertainment and inspiration are just a click away. Our goal is to continuously improve the user experience, expanding our library, and building a community where people can connect over shared interests and passions.
            </p>
          </div>

          {/* Right Column (Image) */}
          <div className="relative justify-end mx-6">
            <Image
              src="https://images.pexels.com/photos/5596976/pexels-photo-5596976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="About Us" 
              width={800}
              height={500}
              className="rounded-xl shadow-lg w-full h-full md:h-[400px]  object-cover md:object-contain"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:px-20 bg-black text-white">
        <div className="container text-center mb-12">
          <h2 className="text-4xl font-bold">Our Team</h2>
          <p className="text-lg mt-4">{teamData.name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
          {teamData.members.map((member, idx) => (
            <div key={idx} className="bg-gray-900 rounded-xl p-6 text-center hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-gray-400 mb-2">{member.role}</p>
              <p className="text-gray-500 text-sm mb-4">{member.period}</p>
              <a 
                href={member.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center text-blue-500 hover:text-blue-700 transition-colors duration-300"
              >
                <FaLinkedin className="mr-2" /> LinkedIn Profile
              </a>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-lg">
            <a 
              href={teamData.hackathon} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline hover:text-blue-700 transition-colors duration-300"
            >
              View Hackathon Details
            </a>
          </p>
        </div>
      </section>

      {/* Future Integrations Section */}
      <section className="py-16 sm:px-20 bg-black text-white">
        <div className="container text-center mb-12">
          <h2 className="text-4xl font-bold">{futureIntegrations.title}</h2>
          <p className="text-lg mt-4">What makes us stand out from the competition</p>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {futureIntegrations.features.map((feature, idx) => (
            <div key={idx} className="flex items-start p-4 border border-gray-700 rounded-lg hover:bg-gray-900 transition duration-300">
              <span className="bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                {idx + 1}
              </span>
              <p className="text-lg">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section with Accordion */}
      <section className="py-16 sm:px-20 bg-black text-white">
        <div className="container text-center py-12">
          <h2 className="text-4xl font-bold mb-8 dark:text-white">Frequently Asked Questions</h2>
          <Accordion type="multiple">
            {faqData.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-lg font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Call to Action Section with Image Background */}
      <section className="py-16  bg-cover md:bg-cover bg-no-repeat  h-full w-full bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/1595238/pexels-photo-1595238.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')" }}>
        <div className="container text-center text-white py-20">
          <h2 className="text-3xl font-bold mb-4">Start Watching Now</h2>
          <p className="text-lg mb-8 mt-8">Join our community and enjoy unlimited access to videos that inspire and entertain.</p>
          <Link href="/register">
            <button className="text-white px-6 py-3 rounded-full text-xl font-semibold transition-all duration-300">
              Get Started Today
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}

