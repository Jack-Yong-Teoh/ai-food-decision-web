"use client";

import { useRouter } from "next/navigation";

import { ROUTES } from "@/constants";
import { useAppDispatch,useAppSelector } from "@/hooks/hook";
import { decrement,increment } from "@/hooks/slices/counterReducer";

export default function AboutPage() {
  const router = useRouter();
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1 className="about__title">About Page</h1>
      <p>This is the about page.</p>
      <div>
        <button onClick={() => router.push(ROUTES.default)}>
          Go Back To Homepage
        </button>
      </div>

      <div>
        <button onClick={() => router.push(ROUTES.service)}>
          Go To Service Page
        </button>
      </div>

      <div>Counter value: {count}</div>
      <div>
        <button onClick={() => dispatch(increment())}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
      </div>
    </div>
  );
}
