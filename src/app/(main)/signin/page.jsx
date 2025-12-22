"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const SignIn = () => {
  const searchParams = useSearchParams();
  const callbackURI = searchParams?.get("callback") || "/";

  const blurFadeVars = {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <main className="min-h-screen w-full bg-background flex flex-col items-center justify-center px-4 font-space">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={blurFadeVars}
        className="w-full max-w-[400px] border-l-2 border-primary px-4 lg:px-8 py-10 bg-card"
      >
        {/* Brand Header */}
        <header className="mb-7">
          <h1 className="text-4xl font-medium text-foreground tracking-tight">
            Einen<span className="text-primary">AI</span>
          </h1>
          <p className="text-primary text-sm mt-2 font-normal">
            Sign in to continue to your workspace.
          </p>
        </header>

        {/* Action Section */}
        <div className="flex flex-col gap-6">
          <p className="text-foreground text-sm font-normal">
            We use Google for secure, passwordless authentication. No separate
            account required.
          </p>

          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn("google", { callbackUrl: callbackURI })}
            className="flex items-center justify-between w-full bg-foreground text-background px-6 py-4 font-semibold text-sm cursor-pointer transition-colors hover:bg-primary uppercase tracking-widest"
          >
            <span>Sign in with Google</span>
            <Image
              src={"/google.png"}
              width={144}
              height={144}
              alt="Google Logo"
              className="w-9"
            />
          </motion.button>
        </div>

        {/* Footer / Legal */}
        <footer className="mt-7">
          <p className="text-primary text-xs uppercase tracking-tighter opacity-70">
            By signing in, you agree to our Terms of Service <br />
            &copy; {new Date().getFullYear()} EinenAI
          </p>
        </footer>
      </motion.div>
    </main>
  );
};

export default SignIn;
