PEM_FILE="../wallet/wallet-owner.pem"
test_sign_CONTRACT="../output/test_sign.wasm"

PROXY_ARGUMENT="--proxy=https://devnet-api.elrond.com"
CHAIN_ARGUMENT="--chain=D"

deploy_test_sign() {

    local OUTFILE="out.json"
    (set -x; erdpy contract deploy --bytecode="$test_sign_CONTRACT" \
        --pem="$PEM_FILE" \
        $PROXY_ARGUMENT $CHAIN_ARGUMENT \
        --outfile="$OUTFILE" --recall-nonce --gas-limit=60000000 \
        --send \
        || return)

    local RESULT_ADDRESS=$(erdpy data parse --file="$OUTFILE" --expression="data['emitted_tx']['address']")
    local RESULT_TRANSACTION=$(erdpy data parse --file="$OUTFILE" --expression="data['emitted_tx']['hash']")

    echo ""
    echo "Deployed contract with:"
    echo "  \$RESULT_ADDRESS == ${RESULT_ADDRESS}"
    echo "  \$RESULT_TRANSACTION == ${RESULT_TRANSACTION}"
    echo ""
}

upgrade_test_sign() {
    local OUTFILE="upgrade.json"
    local CONTRACT_ADDRESS=erd1qqqqqqqqqqqqqpgqacpca334ltmsm8gc78upv03xl7l3ma5m42yqzdm9js

    (set -x; erdpy contract upgrade --metadata-payable ${CONTRACT_ADDRESS} --bytecode="$test_sign_CONTRACT" \
    --pem="$PEM_FILE" \
    $PROXY_ARGUMENT $CHAIN_ARGUMENT \
    --outfile="$OUTFILE" --recall-nonce --gas-limit=60000000 \
    --send \
    --send \
    || return)
}

upgrade_test_sign
# 
# deploy_test_sign