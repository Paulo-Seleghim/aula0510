"use client";
import { useState } from "react";
import Header from "./Header";
import { Search, Plus, Trash2, Download, Filter, X } from "lucide-react";

const initial = [
  ["001245", "Ana Beatriz Souza", 17, "Desenvolvimento de Sistemas", "DS-302", "Ativo"],
  ["001246", "Bruno Henrique Lima", 18, "Automação Industrial", "AI-201", "Ativo"],
  ["001247", "Carolina Mendes", 17, "Administração", "ADM-101", "Ativo"],
  ["001248", "Daniel Oliveira", 18, "Desenvolvimento de Sistemas", "DS-301", "Pendente"],
  ["001249", "Eduardo Santos", 19, "Eletromecânica", "EM-204", "Ativo"],
  ["001250", "Fernanda Alves", 17, "Administração", "ADM-102", "Ativo"],
  ["001251", "Gabriel Martins", 18, "Desenvolvimento de Sistemas", "DS-302", "Ativo"],
  ["001252", "Helena Rodrigues", 17, "Eletrônica", "EL-102", "Ativo"],
];

export default function Students() {
  const [rows, setRows] = useState(initial);
  const [q, setQ] = useState("");
  const [onlyPending, setOnlyPending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: "", idade: "", curso: "Desenvolvimento de Sistemas", turma: "DS-301" });

  const searchTerm = q.trim().toLowerCase();
  const searching = searchTerm.length >= 3;
  const data = rows.filter((x) => {
    const matchesSearch = !searching || x.join(" ").toLowerCase().includes(searchTerm);
    const matchesPending = !onlyPending || x[5] === "Pendente";
    return matchesSearch && matchesPending;
  });

  function addStudent(e) {
    e.preventDefault();
    const nome = form.nome.trim();
    const idade = Number(form.idade);
    if (!nome || !Number.isInteger(idade) || idade < 1 || idade > 120) return;

    const matricula = String(Date.now()).slice(-6);
    setRows((v) => [[matricula, nome, idade, form.curso, form.turma.trim(), "Ativo"], ...v]);
    setForm({ nome: "", idade: "", curso: "Desenvolvimento de Sistemas", turma: "DS-301" });
    setShowForm(false);
  }

  function exportData() {
    const csv = [
      "Matrícula,Aluno,Idade,Curso,Turma,Situação",
      ...rows.map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" }));
    a.download = "alunos-educonnect.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function removeStudent(id) {
    setRows((v) => v.filter((x) => x[0] !== id));
  }

  function toggleStatus(id) {
    setRows((v) => v.map((x) => x[0] === id ? [...x.slice(0, 5), x[5] === "Ativo" ? "Pendente" : "Ativo"] : x));
  }

  return (
    <main className="main">
      <Header title="Alunos" subtitle="Gerencie estudantes, matrículas e situação acadêmica." />
      <div className="content">
        <div className="page-head">
          <div><span className="eyebrow">ACADÊMICO</span><h2>Alunos</h2><p>{rows.length} alunos na lista</p></div>
          <div>
            <button className="button light" onClick={exportData}><Download size={15} /> Exportar</button>{" "}
            <button className="button primary" onClick={() => setShowForm(true)}><Plus size={15} /> Novo aluno</button>
          </div>
        </div>

        <section className="panel table-panel">
          <div className="toolbar">
            <div className="table-search">
              <Search size={16} />
              <input
                placeholder="Buscar aluno, matrícula ou curso..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <button className="button light" onClick={() => setOnlyPending((v) => !v)}>
              <Filter size={15} /> {onlyPending ? "Mostrar todos" : "Só pendentes"}
            </button>
          </div>

          {q.trim().length > 0 && q.trim().length < 3 && (
            <p className="search-hint">Digite pelo menos 3 caracteres para iniciar a pesquisa.</p>
          )}

          <table>
            <thead><tr><th>Matrícula</th><th>Aluno</th><th>Idade</th><th>Curso</th><th>Turma</th><th>Situação</th><th>Ações</th></tr></thead>
            <tbody>{data.map((r) => (
              <tr key={r[0]}>
                <td>#{r[0]}</td><td><b>{r[1]}</b></td><td>{r[2]} anos</td><td>{r[3]}</td><td>{r[4]}</td>
                <td><button className={r[5] === "Ativo" ? "badge success" : "badge warning"} onClick={() => toggleStatus(r[0])}>{r[5]}</button></td>
                <td><button className="icon" title="Excluir aluno" onClick={() => removeStudent(r[0])}><Trash2 size={16} /></button></td>
              </tr>
            ))}</tbody>
          </table>
          {data.length === 0 && <p className="empty-state">Nenhum aluno encontrado.</p>}
        </section>
      </div>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="novo-aluno-titulo">
            <div className="modal-head"><div><span className="eyebrow">ACADÊMICO</span><h3 id="novo-aluno-titulo">Novo aluno</h3></div><button className="icon" onClick={() => setShowForm(false)} aria-label="Fechar"><X size={18} /></button></div>
            <form onSubmit={addStudent}>
              <label>Nome completo<input required autoFocus value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Digite o nome do aluno" /></label>
              <label>Idade<input required type="number" min="1" max="120" value={form.idade} onChange={(e) => setForm({ ...form, idade: e.target.value })} placeholder="Ex.: 17" /></label>
              <label>Curso<select value={form.curso} onChange={(e) => setForm({ ...form, curso: e.target.value })}><option>Desenvolvimento de Sistemas</option><option>Automação Industrial</option><option>Administração</option><option>Eletromecânica</option><option>Eletrônica</option></select></label>
              <label>Turma<input required value={form.turma} onChange={(e) => setForm({ ...form, turma: e.target.value })} placeholder="Ex.: DS-301" /></label>
              <div className="modal-actions"><button type="button" className="button light" onClick={() => setShowForm(false)}>Cancelar</button><button type="submit" className="button primary"><Plus size={15} /> Cadastrar aluno</button></div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
