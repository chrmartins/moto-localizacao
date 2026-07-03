import { rider, mapsDirUrl } from "@/lib/rider";
import ShareLocationButton from "./ShareLocationButton";
import PolicyReveal from "./PolicyReveal";
import MoreInfo from "./MoreInfo";

const HospitalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinejoin="round">
    <path d="M5 21V4a1 1 0 011-1h12a1 1 0 011 1v17" />
    <path d="M3 21h18" />
    <path d="M12 7v4M10 9h4" />
    <path d="M10 21v-3h4v3" />
  </svg>
);

const NavArrow = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M21.4 10.6 13.4 2.6a2 2 0 0 0-2.8 0l-8 8a2 2 0 0 0 0 2.8l8 8a2 2 0 0 0 2.8 0l8-8a2 2 0 0 0 0-2.8ZM10 15v-3H8.5a1 1 0 0 0-1 1v1.5H6V12a2.5 2.5 0 0 1 2.5-2.5H10V7l3.5 4Z" />
  </svg>
);

export default function Page() {
  return (
    <>
      <div className="idbar">
        <div className="brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5" cy="17" r="3" />
            <circle cx="19" cy="17" r="3" />
            <path d="M8 17h6l3-6h-3l-2-3H6" />
            <path d="M14 8l2-2h3" />
          </svg>
          RIDER ID
        </div>
        <div className="live">
          <span className="dot" /> Localização ativa
        </div>
      </div>

      {/* EMERGÊNCIA */}
      <div className="alert">
        <div className="alert-in">
          <div className="alert-kicker">
            <span className="blink" /> Encontrou este capacete? Aja agora
          </div>
          <h1 className="headline">{rider.firstName} está ferido?</h1>
          <div className="sub">
            Fale o nome dele em voz alta e siga os passos abaixo. Você pode salvar uma vida.
          </div>

          <div className="helmet">
            <div className="h-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M3 13a9 9 0 0118 0v2a2 2 0 01-2 2h-6l-2 3-2-3H5a2 2 0 01-2-2z" />
                <path d="M3 13h18" />
              </svg>
            </div>
            <div className="h-tx">
              <b>Não remova o capacete</b>
              <span>
                Só se ele não estiver respirando. Movê-lo errado pode causar lesão grave na coluna.
                Espere o SAMU.
              </span>
            </div>
          </div>

          <div className="actions">
            <a className="btn samu" href="tel:192">
              <div className="b-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
                </svg>
              </div>
              <div className="b-tx">
                <div className="t">Ligar para o SAMU · 192</div>
                <div className="s">Ambulância e resgate</div>
              </div>
              <div className="b-go">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </a>

            <a className="btn contact" href={`tel:${rider.emergencyContact.phone}`}>
              <div className="b-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="b-tx">
                <div className="t">Avisar a família</div>
                <div className="s">
                  {rider.emergencyContact.name} ({rider.emergencyContact.relation}) ·{" "}
                  {rider.emergencyContact.phoneLabel}
                </div>
              </div>
              <div className="b-go">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </a>

            <ShareLocationButton
              whatsapp={rider.emergencyContact.whatsapp}
              firstName={rider.firstName}
            />
          </div>
        </div>
      </div>

      {rider.demoMode && (
        <div className="demo">Protótipo · dados de exemplo para você validar o visual</div>
      )}

      <div className="wrap">
        {/* DADOS VITAIS */}
        <div className="section">
          <div className="sec-title">
            <span className="bar" />
            <h3>Dados vitais · para o socorro</h3>
          </div>
          <div className="vitals">
            <div className="vital blood">
              <div className="lbl">Tipo sanguíneo</div>
              <div className="val">{rider.vitals.bloodType}</div>
            </div>
            <div className="vital">
              <div className="lbl">Alergias a remédios</div>
              <div className="val alert-txt">{rider.vitals.allergies}</div>
            </div>
            <div className="vital wide">
              <div className="lbl">Condições de saúde</div>
              <div className="val">{rider.vitals.conditions}</div>
            </div>
            <div className="vital">
              <div className="lbl">Idade</div>
              <div className="val">{rider.vitals.age}</div>
            </div>
            <div className="vital">
              <div className="lbl">Peso aprox.</div>
              <div className="val">{rider.vitals.weight}</div>
            </div>
            <div className="vital wide">
              <div className="lbl">Plano de saúde / preferência</div>
              <div className="val">{rider.vitals.healthPlanPreference}</div>
            </div>
          </div>
        </div>

        {/* LOCALIZAÇÃO */}
        <div className="section">
          <div className="sec-title">
            <span className="bar" />
            <h3>Localização atual</h3>
          </div>
          <div className="map">
            <svg viewBox="0 0 400 150" preserveAspectRatio="none">
              <rect width="400" height="150" fill="#161b22" />
              <path d="M0 40 Q100 30 200 60 T400 50" stroke="#232a33" strokeWidth={10} fill="none" />
              <path d="M-20 110 Q120 100 210 130 T420 120" stroke="#232a33" strokeWidth={14} fill="none" />
              <path d="M60 -10 Q90 60 150 90 T230 160" stroke="#232a33" strokeWidth={8} fill="none" />
              <rect x="30" y="70" width="34" height="26" rx="3" fill="#1c222b" />
              <rect x="300" y="20" width="40" height="30" rx="3" fill="#1c222b" />
              <rect x="250" y="95" width="30" height="34" rx="3" fill="#1c222b" />
              <circle cx="200" cy="75" r="34" fill="rgba(255,138,30,.14)" />
            </svg>
            <div className="map-legend">
              <i /> Hospitais próximos
            </div>
            <div className="hpin" style={{ top: "28%", left: "74%" }}>
              <div className="badge"><HospitalIcon /></div>
            </div>
            <div className="hpin" style={{ top: "70%", left: "30%" }}>
              <div className="badge"><HospitalIcon /></div>
            </div>
            <div className="hpin" style={{ top: "24%", left: "24%" }}>
              <div className="badge"><HospitalIcon /></div>
            </div>
            <div className="pin">
              <svg viewBox="0 0 24 24" fill="#ff8a1e" stroke="#0d0f12" strokeWidth={1.4}>
                <path d="M12 2c3.9 0 7 3.1 7 7 0 5-7 13-7 13S5 14 5 9c0-3.9 3.1-7 7-7z" />
                <circle cx="12" cy="9" r="2.6" fill="#0d0f12" />
              </svg>
            </div>
            <div className="map-foot">
              <b>{rider.location.label}</b>
              <span className="upd">{rider.location.updated}</span>
            </div>
          </div>
        </div>

        {/* HOSPITAIS */}
        <div className="section">
          <div className="sec-title">
            <span className="bar" />
            <h3>Hospitais mais próximos</h3>
          </div>
          <div className="card">
            {rider.hospitals.map((h) => (
              <a
                key={h.name}
                className="hosp"
                href={mapsDirUrl(h.mapsQuery)}
                target="_blank"
                rel="noopener"
              >
                <div className="rank"><HospitalIcon /></div>
                <div className="info">
                  <div className="hn">{h.name}</div>
                  <div className="hm">
                    {h.emergency ? <span className="em">● {h.info}</span> : h.info}
                  </div>
                </div>
                <div className="dist">
                  <div className="d">{h.distanceKm}</div>
                  <div className="t">{h.timeMin}</div>
                </div>
                <div className="route"><NavArrow /></div>
              </a>
            ))}
          </div>
        </div>

        {/* ASSISTÊNCIA & SEGURO */}
        <div className="section">
          <div className="sec-title">
            <span className="bar" />
            <h3>Assistência &amp; Seguro</h3>
          </div>
          <div className="card">
            <a className="tow" href={`tel:${rider.assistance.towPhone}`}>
              <div className="b-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 17h4V5H2v12h3" />
                  <path d="M20 17h2v-3.3a1 1 0 00-.3-.7l-2.8-2.8a1 1 0 00-.7-.2H14v7h2" />
                  <circle cx="7.5" cy="17.5" r="2.5" />
                  <circle cx="17.5" cy="17.5" r="2.5" />
                </svg>
              </div>
              <div className="b-tx">
                <div className="t">Chamar guincho 24h</div>
                <div className="s">{rider.assistance.towName} · retirar a moto da via</div>
              </div>
              <div className="b-go">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </a>
            <PolicyReveal
              insurer={rider.assistance.insurer}
              masked={rider.assistance.policyMasked}
              full={rider.assistance.policyNumber}
            />
          </div>
        </div>
      </div>

      {/* MAIS INFORMAÇÕES */}
      <MoreInfo />

      <div className="footer">
        <div className="line" />
        <p className="lg">Rider ID</p>
        <p>
          Perfil vinculado ao QR Code do capacete.
          <br />
          Suas informações, sempre à mão de quem precisar.
        </p>
      </div>
    </>
  );
}
