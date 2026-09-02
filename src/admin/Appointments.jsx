import { useState } from 'react';
import { APPOINTMENTS } from './data';
import s from './admin.module.css';

const DAYS = ['Today', 'Tomorrow', 'Wednesday'];

export default function Appointments() {
  const [state, setState] = useState(() =>
    Object.fromEntries(APPOINTMENTS.map((a) => [a.id, a.status]))
  );

  const set = (id, status) => setState((p) => ({ ...p, [id]: status }));
  const countBy = (st) => Object.values(state).filter((v) => v === st).length;

  return (
    <>
      <div className={s.kpis}>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Booked this week</span>
          <div className={s.kpiValue}>{APPOINTMENTS.length}</div>
          <span className={s.kpiDelta}>Across three days</span>
        </div>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Confirmed</span>
          <div className={s.kpiValue}>{countBy('Confirmed')}</div>
          <span className={`${s.kpiDelta} ${s.kpiUp}`}>Ready to go</span>
        </div>
        <div className={`${s.kpi} ${countBy('Pending') ? s.kpiWarn : ''}`}>
          <span className={s.kpiLabel}>Awaiting confirmation</span>
          <div className={s.kpiValue}>{countBy('Pending')}</div>
          <span className={`${s.kpiDelta} ${s.kpiBad}`}>Call to confirm</span>
        </div>
        <div className={s.kpi}>
          <span className={s.kpiLabel}>Cancelled</span>
          <div className={s.kpiValue}>{countBy('Cancelled')}</div>
          <span className={s.kpiDelta}>Slots freed up</span>
        </div>
      </div>

      <div className={s.row3}>
        {DAYS.map((day) => {
          const list = APPOINTMENTS.filter((a) => a.day === day);
          return (
            <section className={s.card} key={day}>
              <header className={s.cardHead}>
                <div>
                  <span className={s.cardEyebrow}>{day}</span>
                  <h2>{list.length} {list.length === 1 ? 'fitting' : 'fittings'}</h2>
                </div>
              </header>
              {list.length === 0 ? (
                <p className={s.emptyNote}>Nothing booked.</p>
              ) : (
                <ul className={s.appts}>
                  {list.map((a) => (
                    <li key={a.id} className={state[a.id] === 'Cancelled' ? s.apptOff : ''}>
                      <span className={s.apptTime}>{a.time}</span>
                      <div className={s.apptBody}>
                        <b>{a.name}</b>
                        <i>{a.service}</i>
                        {a.note && <em className={s.apptNote}>{a.note}</em>}
                        <span className={s.mono}>{a.phone}</span>
                      </div>
                      <div className={s.apptSide}>
                        <span className={`${s.tag} ${state[a.id] === 'Confirmed' ? s.tagOk : state[a.id] === 'Pending' ? s.tagLow : s.tagOut}`}>
                          {state[a.id]}
                        </span>
                        {state[a.id] === 'Pending' && (
                          <button className={s.smallBtn} onClick={() => set(a.id, 'Confirmed')}>Confirm</button>
                        )}
                        {state[a.id] !== 'Cancelled' && (
                          <button className={s.smallBtnGhost} onClick={() => set(a.id, 'Cancelled')}>Cancel</button>
                        )}
                        {state[a.id] === 'Cancelled' && (
                          <button className={s.smallBtn} onClick={() => set(a.id, 'Pending')}>Restore</button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
