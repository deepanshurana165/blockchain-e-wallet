$(document).ready(()=>{
    let data;
    axios.get('/getKeyPair').then((res)=>{
        $('#privKey').val(res.data.privKey);
        console.log(res);
        data=res;
    });
    $('#signup').on('click',(e)=>{
        // let privKey = $('#searchText').val();
        // e.preventDefault();
        axios.get('/getKeyPair').then((res)=>{
            // console.log(res);
            console.log(res);
            window.location = './wallet.html?pk='+res.data.privKey+'&puk='+res.data.pubKey+'&bal='+res.data.balance;
        });

        });
    });