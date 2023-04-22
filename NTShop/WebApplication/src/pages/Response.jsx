import { useParams } from "react-router-dom"

const Response = () => {
    const { result } = useParams()
    return (
            <div class="card m-5">
                <div class="card-header">
                    Thông báo
                </div>
                <div class="card-body">
                    <h5 class="card-title">Kết quả thanh toán VNPay</h5>
                    <p class="card-text">{result.replaceAll('+', ' ')}</p>
                    <a href="/orders" class="btn btn-info mt-3">Xem đơn hàng</a>
                </div>
            </div>
    )
}

export default Response