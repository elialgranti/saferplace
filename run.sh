echo Sections 1-3
echo ------------
echo
cat inputs/input1.txt | node dist/index.js seating
echo
echo Section 4
echo ------------
echo
cat inputs/input2.txt | node dist/index.js dishes
echo
echo Section 5
echo ------------
echo
node dist/index.js order 20