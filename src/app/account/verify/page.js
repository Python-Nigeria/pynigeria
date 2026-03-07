"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function VerifyPage() {
  const [verify, setVerify] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Extract token from URL e.g. /verify?token=abc123
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        const res = await fetch(
          `${API_BASE}/api/v1/authentication/verify-email/complete/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ token }),
          }
        );

        const data = await res.json();

        if (res.ok) {
          setFirstName(data.first_name || "");
          setVerify(true);
        } else {
          setError(data.message || "Verification failed.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div>
      {verify ? (
        <div className="slide-in text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-display text-3xl text-gray-900 mb-2">
            You're in!
          </h2>
          <p className="text-gray-500 text-sm mb-2">
            Welcome to Python 9ja, <strong>{firstName}</strong>!
          </p>
          <p className="text-gray-400 text-sm mb-8">
            Your account has been verified.
          </p>
          <Link
            href="/account/signin"
            className="btn-green inline-block px-8 py-3.5 rounded-xl text-white font-semibold text-sm"
          >
            Go to Sign In →
          </Link>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="text-center py-8">Verifying...</div>
      )}
    </div>
  );
}