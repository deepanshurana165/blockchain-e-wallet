$(document).ready(()=>{
    $('#searchForm').on('click',(e)=>{
        let receiverPuk = $('#recPubKey').val();
        let amt = $('#money').val();
        axios.post('/transact',{
            recipient: receiverPuk,
            amount: amt
        }).then(()=>{
            window.location = '/wallet.html';
        });
    });
});