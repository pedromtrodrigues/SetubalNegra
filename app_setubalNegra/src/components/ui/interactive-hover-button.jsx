import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function InteractiveHoverButton({
  children,
  className,
  color = "#A37A41",   ...props
}) {
  return (
    <button
      style={{ "--button-color": color }} // Criamos uma variável CSS dinâmica
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border p-3 px-8 text-center font-semibold bg-white", 
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center">
        {/* Esta é a "bolinha" - agora absoluta, centralizada e invisível no início */}
        <div
          style={{ backgroundColor: color }}
          className="absolute h-1 w-1 rounded-full opacity-0 transition-all duration-1000 group-hover:scale-[100.8] group-hover:opacity-100"
        ></div>

        <span className="relative z-20 inline-block transition-all duration-1000 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
            
      {/* O texto que aparece no hover (ajustado para ser sempre branco ou outra cor de contraste) */}
      <div
        className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100 text-white"
      >
        <span>{children}</span>
        <ArrowRight />
      </div>
    </button>
  );
}