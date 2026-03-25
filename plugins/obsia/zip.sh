
printf "Deleting last version ...\n"
rm -r $HOME/Downloads/obsia.zip || echo "No obsia.zip, skipping deletion ..."
printf "[OK] Deleted last version\n"

printf "Creating new Obsia Plugin version ..."
zip -9 -r \
  ~/Downloads/obsia.zip \
  ./* \
  -x "./node_modules/*" \
  -x "./zip.sh" \
  -x "./bun.lock" \
  -x "./package.json" \
  -x "./designs/*/original/*"
printf "[OK] Created new Obsia Plugin zip file\n"
