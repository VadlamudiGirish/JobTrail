"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center p-4 mt-8 text-sm text-gray-600">
      <p>{new Date().getFullYear()} JobTrail. MIT license.</p>
    </footer>
  );
}
