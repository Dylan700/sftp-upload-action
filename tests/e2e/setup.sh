git reset --hard HEAD
git clean -fdx

echo "$PRIVATE_KEY" > ./key
chmod 600 ./key
mkdir ./tmp