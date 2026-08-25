import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useState, useEffect, useRef } from "react";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll"

export const AnimacionesDev = () => {
  const demoRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const loaderRef = useRef(null);
  const scrollRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useGSAP(
    () => {
      gsap.from(demoRef.current, {
        x: -200,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });
      
      gsap.from(leftPanelRef.current, {
        x: -300,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.from(rightPanelRef.current, {
        x: 300,
        opacity: 0,
        duration: 1.2,
        delay: 0.2,
        ease: "power3.out",
      });

      if (loaderRef.current) {
        gsap.to(loaderRef.current.querySelectorAll(".loader-dot"), {
          scale: 1.4,
          opacity: 0.3,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          stagger: 0.2,
          ease: "power1.inOut",
        });
      }
    },
    { scope: demoRef },
  );

  useRevealOnScroll(scrollRef, "right", {
    distance: 160,
    duration: 3.2,
    start: "top 80%"
  })

  return (
    <>
      {isLoading && (
        <div
          ref={loaderRef}
          className="position-fixed top-0 start-0 w-100 vh-100 d-flex flex-column justify-content-center align-items-center"
          role="status"
          aria-label="Cargando"
          style={{
            backgroundColor: "#EAF7FA",
            color: "#12343B",
            zIndex: 1050,
          }}
        >
          <div className="d-flex gap-2 align-items-center">
            <span
              className="loader-dot"
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#078A9A",
                display: "inline-block",
              }}
            ></span>
            <span
              className="loader-dot"
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#078A9A",
                display: "inline-block",
              }}
            ></span>
            <span
              className="loader-dot"
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#078A9A",
                display: "inline-block",
              }}
            ></span>
            <span className="visually-hidden">Cargando informacion</span>
          </div>
        </div>
      )}
      <main className="container py-5">
        <h1>Laboratorio de Animaciones</h1>

        <section ref={scrollRef}
        className="p-5"
        style={{
          minHeight: "50vh",
          marginTop: "10vh",
          backgroundColor: "#D4F0F5",
          color: "#12343B"
        }}>

          <h2>Sección animada al hacer scroll</h2>
          <p>Esta sección aparece desde la derecha cuando entra en la ventana.</p>
        </section>

        <div
          ref={demoRef}
          className="pt-5 mt-4"
          style={{ backgroundColor: "#EAF7FA", color: "#12343B" }}
        >
          Este bloque entra desde la izquierda{" "}
        </div>

        <div className="d-flex gap-3 mt-4">
          <div
            ref={leftPanelRef}
            style={{ backgroundColor: "#EAF7FA", color: "#12343B" }}
          >
            Panel Izquierdo
          </div>
          <div
            ref={rightPanelRef}
            style={{ backgroundColor: "#12343B", color: "#FFFFFF" }}
          >
            Panel Derecho
          </div>
        </div>
      </main>
    </>
  );
};
