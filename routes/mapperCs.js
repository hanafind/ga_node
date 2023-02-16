// FAQ 정보
let sqlFaqList = 
`select * from cs.faq`;
let sqlConsultSeq = 
`SELECT last_value as seq FROM cs.consult_history_idx_seq`

exports.sqlFaqList = sqlFaqList;
exports.sqlConsultSeq= sqlConsultSeq;
