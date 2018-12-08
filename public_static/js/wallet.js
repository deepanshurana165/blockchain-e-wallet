$(document).ready(()=>{
    axios.get('/getKeyPair').then((res) => {
        let privKey = res.data.privKey;
        let pubkey = res.data.pubKey;
        let balance = res.data.balance;
        $('#priv-key').val(privKey);
        $('#pub-key').val(pubkey);
        $('#money').html(balance);
        console.log(res);
    });
    $('#transHistory').on('click',()=>{
        axios.get('/transactionHistory').then((res)=>{
            $('#trans').html(JSON.stringify(res.data));
        })
    });
});