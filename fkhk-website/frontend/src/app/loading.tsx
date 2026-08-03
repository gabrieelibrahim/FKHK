import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-[#fcfaf8]">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 rounded-full border-4 border-[#d1e8e8]" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2C5857] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/assets/logo/logo fkhk hijau.png"
            alt="FKHK"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-contain"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}