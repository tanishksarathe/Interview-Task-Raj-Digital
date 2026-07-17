import { Calendar, Clock, Users, ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar/>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-5 md:px-6 py-16 md:py-20 text-center">
          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs md:text-sm text-zinc-300">
            Smart Teacher Meeting Scheduler
          </span>

          <h1 className="mt-5 max-w-3xl text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Schedule Parent & Teacher Meetings
            <span className="block text-zinc-500">
              Without The Chaos.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm md:text-base leading-7 text-zinc-400">
            Organize meetings effortlessly with real-time availability,
            automated scheduling, secure authentication, and instant
            notifications—all in one place.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <button className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-105">
              Get Started
              <ArrowRight size={18} />
            </button>

            <button className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm transition hover:border-white">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="mt-14 grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["500+", "Meetings"],
              ["100+", "Teachers"],
              ["1000+", "Parents"],
              ["99.9%", "Uptime"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold">{value}</h2>
                <p className="mt-1 text-xs md:text-sm text-zinc-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 text-center">
          <p className="text-zinc-500 uppercase tracking-widest">
            Features
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Everything You Need
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Built to simplify scheduling while giving teachers,
            parents, and administrators a seamless experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Calendar,
              title: "Easy Scheduling",
              desc: "Book meetings based on teacher availability without back-and-forth communication.",
            },
            {
              icon: Clock,
              title: "Time Slot Management",
              desc: "Automatically prevent overlapping meetings and manage schedules efficiently.",
            },
            {
              icon: Users,
              title: "Role Based Access",
              desc: "Separate dashboards for Admin, Teachers, and Parents with secure authentication.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-zinc-800 bg-zinc-950 p-8 transition hover:border-white"
            >
              <feature.icon
                className="rounded-xl border border-zinc-700 p-3"
                size={58}
              />

              <h3 className="mt-6 text-2xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-4 leading-7 text-zinc-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-zinc-800 bg-zinc-950">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <p className="text-zinc-500 uppercase tracking-widest">
              Why Choose Us
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              Save Time.
              <br />
              Stay Organized.
            </h2>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Replace manual scheduling with a smart platform that
              keeps everyone informed and reduces administrative work.
            </p>
          </div>

          <div className="space-y-6">
            {[
              "Real-time teacher availability",
              "Automated meeting confirmation",
              "Secure authentication",
              "Responsive on every device",
              "Simple and intuitive interface",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-zinc-800 p-5"
              >
                <CheckCircle className="text-white" />
                <span className="text-zinc-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-4xl rounded-[40px] border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-16 text-center">
          <h2 className="text-5xl font-bold">
            Ready to Simplify Scheduling?
          </h2>

          <p className="mt-6 text-zinc-400">
            Create meetings in seconds and keep teachers, parents,
            and administrators connected.
          </p>

          <button className="mt-10 rounded-full bg-white px-8 py-4 font-semibold text-black transition hover:scale-105">
            Start Scheduling
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} MeetSync • Teacher Meeting Scheduler
      </footer>
    </div>
  );
}