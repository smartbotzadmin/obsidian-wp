zip -9 -r \
  ~/Downloads/obsia.zip \
  ./* \
  -x "./node_modules/*" \
  -x "./zip.sh" \
  -x "./bun.lock" \
  -x "./package.json"
