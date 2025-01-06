;; Holographic Universe Model NFT Contract

(define-non-fungible-token holographic-model-nft uint)

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_INVALID_NFT (err u101))

;; Data variables
(define-data-var last-token-id uint u0)

;; Data maps
(define-map token-metadata
  uint
  {
    creator: principal,
    name: (string-ascii 64),
    description: (string-utf8 256),
    model-hash: (buff 32),
    simulation-id: uint,
    creation-time: uint,
    significance-score: uint
  }
)

;; Public functions
(define-public (mint-holographic-model (name (string-ascii 64)) (description (string-utf8 256)) (model-hash (buff 32)) (simulation-id uint) (significance-score uint))
  (let
    (
      (token-id (+ (var-get last-token-id) u1))
    )
    (asserts! (and (>= significance-score u0) (<= significance-score u100)) ERR_NOT_AUTHORIZED)
    (try! (nft-mint? holographic-model-nft token-id tx-sender))
    (map-set token-metadata
      token-id
      {
        creator: tx-sender,
        name: name,
        description: description,
        model-hash: model-hash,
        simulation-id: simulation-id,
        creation-time: block-height,
        significance-score: significance-score
      }
    )
    (var-set last-token-id token-id)
    (ok token-id)
  )
)

(define-public (transfer-holographic-model (token-id uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (unwrap! (nft-get-owner? holographic-model-nft token-id) ERR_INVALID_NFT)) ERR_NOT_AUTHORIZED)
    (try! (nft-transfer? holographic-model-nft token-id tx-sender recipient))
    (ok true)
  )
)

;; Read-only functions
(define-read-only (get-holographic-model-metadata (token-id uint))
  (map-get? token-metadata token-id)
)

(define-read-only (get-holographic-model-owner (token-id uint))
  (nft-get-owner? holographic-model-nft token-id)
)

(define-read-only (get-last-token-id)
  (var-get last-token-id)
)

