$(document).ready(()=>{
    $('#searchForm').on('submit',(e)=>{
        let privKey = $('#searchText').val();
        e.preventDefault();
        axios.post('/login/privkey',{
            'privkey': privKey
        }).then((res)=>{
            let data = {
                privKey: res.privKey,
                pubKey: res.pubKey,
                balance: res.balance
            };
            window.location = '/wallet.html';
        });
    })
});