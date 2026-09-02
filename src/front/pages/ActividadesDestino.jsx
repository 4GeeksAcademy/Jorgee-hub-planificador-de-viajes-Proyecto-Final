import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export const ActividadesDestino = () => {
  const { id, destinoId } = useParams();
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);
  const [actividad, setActividad] = useState({
    name: "",
    description: "",
    date: "",
    time: ""
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const cargarActividades = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/destinations/${destinoId}/activities`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setActividades(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarActividades();
  }, [destinoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editando 
        ? `${import.meta.env.VITE_BACKEND_URL}/api/activities/${editando.id}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/destinations/${destinoId}/activities`;
      
      const method = editando ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(actividad)
      });
      
      if (res.ok) {
        const data = await res.json();
        if (editando) {
          setActividades(actividades.map(a => a.id === data.id ? data : a));
          setEditando(null);
        } else {
          setActividades([...actividades, data]);
        }
        setMostrarFormulario(false);
        setActividad({ name: "", description: "", date: "", time: "" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEliminar = async (actividadId) => {
    if (!window.confirm("¿Eliminar esta actividad?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/activities/${actividadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setActividades(actividades.filter(a => a.id !== actividadId));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditar = (act) => {
    setEditando(act);
    setActividad(act);
    setMostrarFormulario(true);
  };

  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <p style={{ color: "#456B75" }}>Cargando actividades...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontFamily: "Fraunces, Georgia, serif", color: "#12343B" }}>
          📋 Actividades
        </h2>
        <Link to={`/trips/${id}`} className="btn btn-outline-secondary">
          ← Volver al viaje
        </Link>
      </div>
      
      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn"
          style={{ backgroundColor: "#28C3D4", color: "#FFFFFF", fontWeight: "bold" }}
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            if (!mostrarFormulario) {
              setEditando(null);
              setActividad({ name: "", description: "", date: "", time: "" });
            }
          }}
        >
          {mostrarFormulario ? "✕ Cancelar" : "+ Agregar Actividad"}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="mb-4 p-4" style={{ backgroundColor: "#FFFFFF" }}>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Nombre" required
                  value={actividad.name} onChange={(e) => setActividad({...actividad, name: e.target.value})} />
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Descripción"
                  value={actividad.description} onChange={(e) => setActividad({...actividad, description: e.target.value})} />
              </div>
              <div className="col-md-2">
                <input type="date" className="form-control" required
                  value={actividad.date} onChange={(e) => setActividad({...actividad, date: e.target.value})} />
              </div>
              <div className="col-md-2">
                <input type="time" className="form-control"
                  value={actividad.time} onChange={(e) => setActividad({...actividad, time: e.target.value})} />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn w-100" style={{ backgroundColor: "#28C3D4", color: "#FFFFFF" }}>
                  {editando ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {actividades.length === 0 ? (
        <div className="text-center py-4" style={{ color: "#456B75" }}>
          No hay actividades planificadas
        </div>
      ) : (
        <div className="list-group">
          {actividades.map(act => (
            <div key={act.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5 style={{ color: "#12343B" }}>{act.name}</h5>
                {act.description && <p className="mb-1" style={{ color: "#456B75" }}>{act.description}</p>}
                <small style={{ color: "#078A9A" }}>{act.date} {act.time && `• ${act.time}`}</small>
              </div>
              <div>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEditar(act)}>
                  ✏️
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(act.id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};