import { useState } from "preact/hooks";
export function Home() {
  const title: string = "Prayer Time";

  return (
    <div class="w-full flex justify-center items-center p-2">
      <div class="max-w-lg min-w-3xs flex flex-col gap-y-4 justify-start items-start p-2">
        <h1 class="text-lg text-slate-900 font-semibold">{title}</h1>
      </div>
    </div>
  )
}