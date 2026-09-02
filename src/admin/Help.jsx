import Intro from './Intro';
import s from './admin.module.css';

/**
 * What every section is for, in one place. Written for someone who has never
 * used a system like this, so it says what the section does and what she can
 * actually do there. No jargon, and nothing describing the software itself.
 */
const SECTIONS = [
  {
    group: 'Every day',
    items: [
      { name: 'Overview', what: 'The first thing you see each morning. It shows what needs doing today: orders to pack, pieces to reorder, and who is coming in for a fitting.', can: 'Read it and tap through to whatever needs attention.' },
      { name: 'Point of Sale', what: 'The counter. Use it when somebody is standing in the shop and wants to buy.', can: 'Search a piece, add it to the sale, choose how they are paying, then finish the sale.' },
      { name: 'Orders', what: 'Everything bought online or on WhatsApp that has to be packed and sent.', can: 'See what is in each order, and move it along as you go: paid, packing, shipped, delivered.' },
      { name: 'Fittings', what: 'The appointment diary for the fitting room.', can: 'See who is booked and when, confirm them, or cancel if they call off.' },
    ],
  },
  {
    group: 'The shop',
    items: [
      { name: 'Products', what: 'Everything you sell, with the price and how many are left.', can: 'Search a piece, add or remove stock as it comes in or goes out, and spot what is running low.' },
      { name: 'Suppliers', what: 'The people you buy from, and their phone numbers.', can: 'Find who to call when something runs out. The list puts the most urgent at the top.' },
      { name: 'Customers', what: 'Everyone who has bought from you, and what they have spent.', can: 'Look someone up by name, area or phone, and see whether you already have their size.' },
      { name: 'Credit Book', what: 'People who took something home and have not paid yet.', can: 'See who owes what and for how long, and clear them off once they pay.' },
    ],
  },
  {
    group: 'Money',
    items: [
      { name: 'Expenses', what: 'Money going out: rent, wages, stock, transport and the rest.', can: 'Record what you paid for, and see what the shop has left after paying for everything.' },
      { name: 'Reports', what: 'How the shop is doing this month, written in plain words.', can: 'Read it. There is nothing to press.' },
    ],
  },
  {
    group: 'Setting up',
    items: [
      { name: 'Settings', what: 'Your shop details, opening times, delivery charges and discount codes.', can: 'Change anything that does not shift day to day.' },
    ],
  },
];

const ANSWERS = [
  {
    q: 'Somebody is buying in the shop right now. Where do I go?',
    a: 'Point of Sale. Find the piece, add it, take the money, press Finish sale.',
  },
  {
    q: 'A piece has finished. What do I do?',
    a: 'Go to Suppliers, find who sells it, and call the number there. When the new stock arrives, go to Products and add the pieces back.',
  },
  {
    q: 'Somebody wants to pay later.',
    a: 'At the counter choose On credit when you take the payment. Their name goes into the Credit Book so you can chase it.',
  },
  {
    q: 'How do I know if the shop made money this month?',
    a: 'Reports. The Left over line is what the shop kept after paying for everything.',
  },
  {
    q: 'I made a mistake. Can I undo it?',
    a: 'Nothing here is permanent in this sample, so tap around freely. On the real system every change is saved and can be corrected.',
  },
];

export default function Help() {
  return (
    <>
      <Intro>
        What every part of this system is for. Start here if you are not sure
        where something lives.
      </Intro>

      {SECTIONS.map((g) => (
        <section className={s.card} key={g.group}>
          <header className={s.cardHead}>
            <div>
              <span className={s.cardEyebrow}>{g.group}</span>
              <h2>{g.items.length} {g.items.length === 1 ? 'section' : 'sections'}</h2>
            </div>
          </header>
          <ul className={s.helpList}>
            {g.items.map((i) => (
              <li key={i.name}>
                <b className={s.helpName}>{i.name}</b>
                <p className={s.helpWhat}>{i.what}</p>
                <p className={s.helpCan}><span>You can</span> {i.can}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className={s.card}>
        <header className={s.cardHead}>
          <div>
            <span className={s.cardEyebrow}>Quick answers</span>
            <h2>If you are stuck</h2>
          </div>
        </header>
        <ul className={s.helpList}>
          {ANSWERS.map((a) => (
            <li key={a.q}>
              <b className={s.helpName}>{a.q}</b>
              <p className={s.helpWhat}>{a.a}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
