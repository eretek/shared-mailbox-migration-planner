/*! Eretek Online Araçlar #42 — Microsoft 365 Shared Mailbox Geçiş Planı */
ERT.def('42', {
	run: function (v, c) {
		var r = c.csv(v.csv, 'csv', 20000), H = r.head, col = function (n) { return ERT.csv.col(H, n); };
		var iM = col(['mailbox', 'primarysmtpaddress', 'name']), iS = col(['size_gb', 'size', 'totalitemsize']), iA = col(['archive_gb', 'archive']), iH = col(['hold', 'litigationhold', 'litigationholdenabled']), iO = col(['owner', 'sahip']), iD = col(['delegates', 'fullaccess', 'delege']);
		if (iM < 0) { throw c.fe('csv', 'col', { c: 'mailbox' }); }
		if (iS < 0) { throw c.fe('csv', 'col', { c: 'size_gb' }); }
		var rows = [], cls = [], items = [];
		r.rows.forEach(function (x, i) {
			var size = ERT.parseNum(x[iS], 'en'), arch = iA >= 0 && x[iA] !== '' ? ERT.parseNum(x[iA], 'en') : 0, holdRaw = iH >= 0 ? String(x[iH] || '').trim().toLowerCase() : '';
			if (isNaN(size)) { throw c.fe('csv', 'rowNum', { r: i + 2 }); }
			var hold = /^(yes|true|evet|ja|1)$/.test(holdRaw) ? true : (/^(no|false|hayır|hayir|nein|0)$/.test(holdRaw) ? false : null);
			var reasons = [], lic, check = [];
			if (size > 50) { reasons.push(c.t('r_size')); }
			if (arch > 0) { reasons.push(c.t('r_arch')); }
			if (hold === true) { reasons.push(c.t('r_hold')); }
			if (hold === null) { check.push(c.t('chkHold')); }
			if (size > 45 && size <= 50) { check.push(c.t('near')); }
			lic = reasons.length ? 'yes' : (check.length && hold === null ? 'verify' : 'no');
			var owner = iO >= 0 ? (x[iO] || '').trim() : '', del = iD >= 0 ? (x[iD] || '').trim() : '';
			if (!owner) { check.push(c.t('noOwner')); }
			if (iD >= 0 && (!del || del === '0')) { check.push(c.t('noDel')); }
			rows.push([x[iM], c.n(size, 1), c.n(arch, 1), hold === null ? c.t('unknown') : c.yn(hold), owner || '–', c.t('l_' + lic), reasons.join('; ') || '–', check.join('; ') || '–']);
			cls.push(lic === 'yes' ? 'warn' : (lic === 'verify' || check.length ? 'info' : 'ok'));
			items.push({ m: x[iM], lic: lic });
		});
		var cols = [c.t('c_mb'), c.t('c_size'), c.t('c_arch'), c.t('c_hold'), c.t('c_owner'), c.t('c_lic'), c.t('c_why'), c.t('c_check')];
		return { big: c.t('big', { n: items.filter(function (i) { return i.lic === 'yes'; }).length, t: items.length }), msgs: [['info', c.t('rule')], ['info', c.t('verifyDocs')]], tables: [{ cols: cols, rows: rows, cls: cls }], x: { csv: { name: 'shared-mailbox-plan', cols: cols, rows: rows } }, v: { items: items } };
	}
});
