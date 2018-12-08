$(document).ready(()=>{
    $('#searchForm').on('click',(e)=>{
        let amt = $('#money').val();
        axios.post('/login/addmoney',{
            amount: amt
        }).then(()=>{
            window.location = '/wallet.html';
        });
    });
});