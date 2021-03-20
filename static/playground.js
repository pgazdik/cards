const o_date = new Intl.DateTimeFormat();
const f_date = (m_ca, m_it) => Object({...m_ca, [m_it.type]: m_it.value});
const parts = o_date.formatToParts();
const m_date = parts.reduce(f_date, {});
console.log(m_date.day + '-' + m_date.month + '-' + m_date.year);
